var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   email: String,
   appointments: [Number],
   locationLong: Number,
   locationLat: Number
});

var User = mongoose.model("User", userSchema);

module.exports = User;