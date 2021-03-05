var jwt = require('jsonwebtoken');
var credentials = require('../../config/credentials.js');

module.exports.user = function (req, res, next) {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, credentials.jwt_sign_key, function (err, decoded) {
            if (err)
                return res.status(401).send({ code: 401, sub_code: 17, error: 'You are not authozied' });
            if (decoded) {
                req.user = {
                    _id: decoded._id,
                    t: decoded.t,
                };
                if (req.user.t == "u") {
                    next();
                } else {
                    return res.status(401).send({ code: 401, sub_code: 18, error: 'You are not authozied' });
                }
            }
            else {
                return res.status(401).send({ code: 401, sub_code: 19, error: 'You are not authozied' });
            }
        });
    }
    else {
        return res.status(401).send({ code: 401, sub_code: 20, error: 'You are not authozied' });
    }
}