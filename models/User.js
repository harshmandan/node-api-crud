var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {type: String},
    password: {type: String},
    name: {type: String},
    address: {type: String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});


module.exports = mongoose.model('User', UserSchema);