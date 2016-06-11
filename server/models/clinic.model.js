var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clinicSchema = new Schema({
   clinicName: String,
   locationLong: Number,
   locationLat: Number,
   patients: [Number]
});
var Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;