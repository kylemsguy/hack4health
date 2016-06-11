var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clinicSchema = new Schema({
   clnicName: String,
   locationLong: Number,
   locationLat: Number,
   patients: [
   	{
   		username: String,
   		time: Number
   	}
   ]
});
var Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;