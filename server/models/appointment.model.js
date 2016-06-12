var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = new Schema({
   ended: Boolean,
   appid: Number,
   email: String,
   clinicName: String,
   doctorName: String,
   checkedIn: Boolean,
   distance: Number,
   month: Number,
   day: Number,
   time: Number,
   estimateTime: Number
});

var Appointment = mongoose.model("Appointment", appSchema);

module.exports = Appointment;