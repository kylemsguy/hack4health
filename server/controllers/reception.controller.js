var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());


    //receive clinicName
    //send list of appid, checkedIn, name
    app.post('/clinicLogin', function(req, res){
        console.log(req.body.clinicName);
        Clinic.findOne({clinicName: req.body.clinicName}, function(err, clinic){
            if (err) throw err;
            var patientList = [];
            clinic.patients.forEach(function(pt){
               if (pt.month == req.body.month && pt.day == req.body.day){
                   patientList.push(pt);
               }
            });
            res.send(patientList);
        });
    })  ;
    
};