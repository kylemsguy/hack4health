var request = require("request");
var AWS = require("aws-sdk");

AWS.config.update({region: "us-west-2"});
var ses = new AWS.SES();
var dynamodb = new AWS.DynamoDB();

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
	"Sep", "Oct", "Nov", "Dec"];
var alreadySent = [];
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
/*
sendEmailForAppointment({
	//email: "success@simulator.amazonses.com",
	email: "docnowreminder@gmail.com",
	clinicName: "Not a clinic",
	month: 6,
	day: 12,
	time: 8.5
});
*/
var upperAppointmentBound = 27*60*60*1000; // 27 hours
var lowerAppointmentBound = upperAppointmentBound + 60000; // 27 hours 1 minute
function dateForAppointment(a) {
	return new Date(2016, a.month - 1, a.day, a.time);
}
function messageLoop() {
	// grab all the active appointments
	request./*post(BACKEND_URL + "/allappointments"*/get({url: "http://localhost:8002/allappointments.json", json: true}, function(err, httprequest, response) {
		var allAppointments = response.filter(function(a) {
			if (a.ended || a.checkedIn) return false;
			var theTime = dateForAppointment(a).getTime();
			//return (theTime >= new Date().getTime() + upperAppointmentBound) &&
			//	(theTime <= new Date().getTime() + lowerAppointmentBound);
			return true;
		});
		console.log(allAppointments);
		if (allAppointments.length == 0) return;
		// grab all the dynamo events! Theresgottabeabetterway.mp4
		dynamodb.scan({
			TableName: "sent_notifications",
		}, function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
			var appointmentsMap = {};
			for (var i = 0; i < data.Items.length; i++) {
				appointmentsMap[date.Items[i].Id] = true;
			}
			var unnotificated = allAppointments.filter(function(a) {
				return !appointmentsMap[a.id];
			});
			console.log(unnotificated);
			var writeRequests = [];
			for (var i = 0; i < unnotificated.length; i++) {
				writeRequests.push({
					"PutRequest": {
						"Key": {
							"S": unnotificated[i].appid.toString()
						}
					}
				});
				sendEmailForAppointment(unnotificated[i]);
			}
			dynamodb.batchWriteItem({
				"RequestItems": {
					"sent_notifications": writeRequests
				}
			}, function(err, data) {
				if (err) {
					console.log(err);
				}
			});
		});
	});
}

setTimeout(messageLoop, 5000); // 5 seconds
function createTable() {
	// create the Amazon Dynamo table
	dynamodb.createTable({
		TableName: "sent_notifications",
		KeySchema: [
			{AttributeName: "Id", KeyType: "HASH"}
		],
		AttributeDefinitions: [
			{AttributeName: "Id", AttributeType: "S"},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 1,
			WriteCapacityUnits: 1
		}
	}, function(err, res) {
		console.log(err, res);
	});
}
//createTable();
