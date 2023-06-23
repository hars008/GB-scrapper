const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type:String, required: true},
    email : {type: String, unique: true, required: true},
    password: {type: String, required: true},
    googleId: {type: String},
    googleAccessToken: {type: String},
    googleRefreshToken: {type: String},
});

const UserModel= mongoose.model('User',UserSchema);

module.exports = UserModel;