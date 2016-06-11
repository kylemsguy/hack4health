var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = new Schema({
   appid: Number,
   email: String,
   clinicName: String,
   doctorName: String,
   checkedIn: Boolean,
   distance: Number,
   time: Date
});
var Appointment = mongoose.model("Appointment", appSchema);

module.exports = Appointment;