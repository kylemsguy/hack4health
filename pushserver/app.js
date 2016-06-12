var User = require("../server/models/user.model");
var Appointment = require("../server/models/appointment.model");
var Clinic = require("../server/models/clinic.model");
var config = require("../server/config/index");
var mongoose = require("mongoose");
var AWS = require("aws-sdk");

AWS.config.update({region: "us-west-2"});
var ses = new AWS.SES();
//mongoose.connect(config.getDBConnectionString());

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
	"Sep", "Oct", "Nov", "Dec"];
function endingForNumber(a) {
	if (a > 10 && a < 20) return "th";
	var b = a % 10;
	switch (b) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

function formatTime(appointment) {
	var hr = Math.floor(appointment.time);
	var hr12 = hr == 12? 12: hr % 12;
	var ampm = hr < 12? "AM": "PM";
	var minutes = (appointment.time - hr) * 60;
	var minutesPadded = minutes.toString();
	if (minutesPadded.length < 2) minutesPadded = " " + minutesPadded;
	return hr12 + ":" + minutes + " " + ampm;
}

function formatDate(appointment) {
	return formatTime(appointment) + " on " + monthNames[appointment.month - 1] + " " + appointment.day +
		endingForNumber(appointment.day);
}

function sendEmailForAppointment(appointment) {
	var emailHtml = "Dear Patient:<br>\nthis is a reminder that you have an" +
		" appointment with " + appointment.clinicName + " at " +
		formatDate(appointment) + "; To help reduce waiting time, " +
		"please install the DocNow app at <a href=\"https://github." +
		"com/kylemsguy/hack4health\">https://github.com/" + 
		"kylemsguy/hack4health</a>.<br>\nThank you.";
	var emailPlain = emailHtml.replace(/<[^>]>/g, "");
	var subject = "Reminder: " + appointment.clinicName +
		" appointment at " + formatDate(appointment);
	var params = {
		Destination: {
			ToAddresses: [appointment.email]
		},
		Message: {
			Body: {
				Html: {
					Data: emailHtml,
					Charset: "utf-8"
				},
				Text: {
					Data: emailPlain,
					Charset: "utf-8"
				}
			},
			Subject: {
				Data: subject,
				Charset: "utf-8"
			},
		},
		Source: "docnowreminder@gmail.com"
	};
	ses.sendEmail(params, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(data);
		}
	});
}

sendEmailForAppointment({
	//email: "success@simulator.amazonses.com",
	email: "docnowreminder@gmail.com",
	clinicName: "Not a clinic",
	month: 6,
	day: 12,
	time: 8.5
});

function messageLoop() {
	// poll
}
//setInterval(messageLoop, 60000); // 1 minute
