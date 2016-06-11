var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = new Schema({
   appid: Number,
   username: String,
   clinicName: String,
   doctorName: String,
   checkedIn: Boolean,
   distance: Number,
   time: Number
});
var Appointment = mongoose.model("Appointment", appSchema);

module.exports = Appointment;