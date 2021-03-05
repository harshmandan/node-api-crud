var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
    res.json({code:200, status:"server is up and running"});
});
    
module.exports = router;