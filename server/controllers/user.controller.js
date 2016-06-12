var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
  
    //receive email
    //give back lots of shit
    app.post('/login', function(req, res){
        User.findOne({email: req.body.email}, function(err, userData){
            if (err) throw err;
            console.log(userData);
            
            Appointment.find({'appid': { $in: userData.appointments}}, function(err, docs){
                if (err) throw err; 
                console.log(docs);
                var returnObject = [];
                docs.forEach(function(doc){
                    var hour = Math.floor(doc.time);
                    var min = (doc.time - hour) * 60;
                    
                    var date = new Date(2016, doc.month-1, doc.day, hour, min).getTime().toString();
                    console.log(date);
                    returnObject.push(
                        {
                            appid: doc.appid,
                            email: doc.email,
                            clinicName: doc.clinicName,
                            checkedIn: doc.checkedIn,
                            distance: doc.distance,
                            date: date 
                        });
                });
                res.send(returnObject);
            });

        });
    });
    
    
};