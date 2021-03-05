const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const fs = require("fs-extra");
const resizeImg = require('resize-img');
const fetch = require('node-fetch');
const path = require('path');
const jsonpatch = require('jsonpatch');

async function downloadImage(link) {
    try {
        // Create directory if it does not exist
        fs.mkdirsSync('./uploads'); 
        
        // Get Image Extension & Name
        const fileName = path.basename(link);
        const response = await fetch(link);
        const buffer = await response.buffer();
        
        //Write to buffer and return the created filename
        await fs.writeFile(`./uploads/${fileName}`, buffer);
        return {error: false, fileName};
    } catch(e) {
        return {error: true}
    }
}

router.get('/profile', async function(req, res, next) {
    try {
        let user = await User.findById(req.user._id).select('name email address').lean();
        res.json({code:200, status: user});
    } catch(e) {
        res.status(400).send({code:400, error:e})
    }
});

router.post('/update_profile', async function(req, res, next) {
    if("address" in req.body || "name" in req.body) {
        try {
        //Sanitize the input and get only what we want
        let update = {
            ... "name" in req.body && {name: req.body.name},
            ... "address" in req.body && {address: req.body.address},
            updated_at: new Date()
        };
        await User.findByIdAndUpdate(req.user._id, {$set: {...update}});
        res.json({code:200});
        } catch(e) {
            return res.status(400).send({code:400, error: 'Error updating profile'});
        }
    } else return res.status(400).send({code:400, error: 'Send at least 1 param'});
});

router.post('/json_patch', async function(req, res, next) {
    if("patch" in req.body && "doc" in req.body) {
        try {
            let patched = await jsonpatch.apply_patch(req.body.doc, req.body.patch);
            res.json({code:200, patched});
        } catch(e) {
            return res.status(400).send({code:400, error: 'Error patching'});
        }
    } else return res.status(400).send({code:400, error: 'Send at least 1 param'});
});

router.post('/generate_thumbnail', async function(req, res, next) {
    if("link" in req.body) {
        let result = await downloadImage(req.body.link);
        if(!result.error) {
            try {
                const image = await resizeImg(fs.readFileSync(`./uploads/${result.fileName}`), {
                    width: 50,
                    height: 50
                });
                await fs.writeFileSync(`./uploads/resized-50x50.png`, image); //Overwrite always

                // res.send requires absolute path
                res.sendFile(path.join(__dirname, '../../uploads/resized-50x50.png'));
            } catch(e) {
                return res.status(400).send({code:400, error: 'Error generating thumbnail, are you sure its a valid URL?'}); 
            }
        } else return res.status(400).send({code:400, error: 'Error contacting the remote server'}); 
    } else return res.status(400).send({code:400, error: 'Send link'});
});

module.exports = router;