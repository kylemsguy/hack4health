var User = require('../models/user.model');
var Appointment = require('../models/appointment.model');
var Clinic = require('../models/clinic.model');
var bodyParser = require('body-parser');


module.exports = function(app) {
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());






    
    app.post('/location', function(req, res){
        var query = {email: req.body.email};
        console.log("Updated location for "+req.body.email);
        
        
        //update the user and get their appointment list
        //if any appointment's checkedIn == true && ended == false, then update the distance
        User.findOneAndUpdate(query, {$set:{locationLong: req.body.long, locationLat: req.body.lat}}, {new: true}, function(err, data){
            if (err) throw err;
            console.log(data.appointments);
            //find active appointments, and by active I mean checkedIn appointments
            Appointment.find({'appid': { $in: data.appointments}}, function(err, apps){
                if (err) throw err;
                 
                
                //for each checkedIn appointment, go update distance, then save it
                apps.forEach(function(oneApp){
                    //update distance
                    //go find clinic's long & lat
                    if (oneApp.checkedIn === true && oneApp.ended !== true){
                        Clinic.findOne({clinicName: oneApp.clinicName}, function(err, clinic){
                            if (err) throw err;
                            var long1 = clinic.locationLong;
                            var lat1 = clinic.locationLat;
                            //req.body.long
                            oneApp.distance = find_distance_between_two_points(req.body.lat, lat1, req.body.long, long1);
                            
                            //getDistanceFromLatLonInKm(req.body.lat, req.body.long, lat1, long1);
                            console.log(oneApp.distance);
                            //res.send(oneApp.distance);
                            oneApp.save(function(err){
                                if (err) throw err; 
                            });
                        res.send("success");
                        });
                    } 
                });
            });
        });
        

        //res.end("success");
    });


};

//find distance between two coordinates
var EARTH_RADIUS_IN_METERS =6372797.560856;
var DEG_TO_RAD =0.017453292519943295769236907684886;
function find_distance_between_two_points( point1_lat,point2_lat,point1_lon, point2_lon ) {

    //convert to radian
    var lat1 = point1_lat *DEG_TO_RAD;
    var lat2 = point2_lat *DEG_TO_RAD;
    var lon1 = point1_lon *DEG_TO_RAD;
    var lon2 = point2_lon *DEG_TO_RAD;

    var latAvg = (lat1 + lat2) / 2;
    var cosAvg; //use my cos to find cos(latAvg);
    //long double distance = 0;

    //use taylor series
    //use the magic numbers here, cuz it's 2 am and I'm starving
    // they are 2!, 4!, 6!, etc etc
   cosAvg = 1 - latAvg * latAvg / 2 + latAvg * latAvg * latAvg * latAvg / 24 - latAvg * latAvg * latAvg * latAvg * latAvg * latAvg / 720 
               + (latAvg * latAvg * latAvg * latAvg * latAvg * latAvg * latAvg * latAvg) / (40320);
    
    var x1 = lon1*cosAvg;
    var x2 = lon2*cosAvg;

    //lat2 == y2, lat 1 == y1 in the formula
    var squareDis = (x2 - x1)*(x2 - x1) + (lat2 - lat1)*(lat2 - lat1);
    var distance = EARTH_RADIUS_IN_METERS * Math.sqrt(squareDis);


    return (distance/1000);
}






// function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1); 
//   var a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
//     Math.sin(dLon/2) * Math.sin(dLon/2)
//     ; 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var d = R * c; // Distance in km
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI/180);
// }
