var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clinicSchema = new Schema({
   clinicName: String,
   locationLong: Number,
   locationLat: Number,
   patients: [
   	{
   		email: String,
   		checkedIn: Boolean,
   		month: Number,
   		day: Number,
   		time: Number
   	}
   ]
});
var Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;