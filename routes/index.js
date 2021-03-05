const express = require('express');
const router = express.Router();
const jwt = require('../middlewares/auth/jwt');

// -------------- User Auth routes -------------
router.use('/auth', require('./user/auth'));

// -------------- Protected routes -------------
router.use('/user', jwt.user, require('./user/user'));

// -------------- Common routes ----------------
router.use('/', require('./common/index'));

// Export
module.exports = router;
