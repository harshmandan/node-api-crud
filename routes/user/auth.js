var express = require('express');
var router = express.Router();
var User = require('../../models/User');
var jwt = require('jsonwebtoken');
var credentials = require('../../config/credentials.js');
var bcrypt = require('bcryptjs');

async function findUser(email) {
    let user = await User.findOne({ email: email.trim().toLowerCase()}).select('name email password').lean();
    if(user) {
        return { found: true , user};
    }
	else return { found: false };
}

async function login(user, password) {
    let result = await bcrypt.compare(password, user.password);
    if (result === true) {
        let jwttoken = jwt.sign({ _id: user._id, t: "u" }, credentials.jwt_sign_key);
        return { jwttoken };
    } else return { error: "Incorrect password" };
}

router.post('/login', async function (req, res, next) {
	if (req.body.email && req.body.password) {
        try {

            let find_user = await findUser(req.body.email);
            if(!find_user.found) {
                return res.status(400).send({code:400, error: find_user.error});
            } else {
                let result = await login(find_user.user, req.body.password)
                if(result.error) {
                    return res.status(400).send({code:400, error: result.error});
                } else {
                    return res.json({ code: 200, user:{name: find_user.user.name, email: find_user.user.email}, jwt:result.jwttoken});
                }
            } 
        } catch(e) {
            return res.status(400).send({ code: 400, error: 'Error logging in' });	
        }
	}
	else {
        return res.status(400).send({ code: 400, error: 'Insufficient parameters' });	
    }
});


router.post('/signup', async function (req, res, next) {
	if (req.body.email && req.body.name && req.body.password) {
        try {
            let find_user = await findUser(req.body.email);
            if(find_user.found) {
                return res.status(400).send({ code: 400, message: 'Email exists' });
            } else {
                let hash = await bcrypt.hash(req.body.password, 10);
                let user = await User.create({ email: req.body.email.trim().toLowerCase(), name: req.body.name, password: hash });
                let result = await login(user, req.body.password)
                if(result.error) {
                    return res.status(400).send({code:400, error: result.error});
                } else {
                    res.json({ code: 200, user:{name: user.name, email: user.email}, jwt:result.jwttoken});
                }
            }
        } catch(e) {
            return res.status(400).send({ code: 400, error: 'Error signing up' });	
        }
	}
	else {
		return res.status(400).send({ code: 400, message: 'you are not authorized, please log in first' });
	}
});


module.exports = router;