// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const passportLocalMongoose = require('passport-local-mongoose');
// var User = new Schema({
//     username: {
//         type: String
//     },
//     password: {
//         type: String
//     }
// })
 
// User.plugin(passportLocalMongoose);
 
// module.exports = mongoose.model('User', User)

// ================================

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// This will add passport-local-mongoose methods to the User model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
