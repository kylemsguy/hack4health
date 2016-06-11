var BACKEND_URL="https://hack4health-cherylyli.c9users.io";
angular.module("app", ["ngRoute", "ngResource", "ngCookies"])
.controller("LoginController", function($rootScope, $location, $cookies) {
	var login = this;
	login.submit = function() {
		$cookies.put("clinicName", login.loginData.clinicName);
		$location.path("/appointments");
	}
	login.clinicNames = ["Markham Family Health Team", "Test 2"];
	login.loginData = {clinicName: $cookies.get("clinicName")? $cookies.get("clinicName"): login.clinicNames[0]};
})
.controller("AppointmentsController", function($rootScope, $location, $http, $cookies) {
	var self = this;
	self.activeAppointments = [];
	self.clinicName = $cookies.get("clinicName");
	self.date = new Date();
	self.refresh = function() {
		if (!self.clinicName) {
			$location.path("/");
			return;
		}
		$http.post(BACKEND_URL + "/clinicLogin", {
			clinicName: self.clinicName,
			month: self.date.getMonth() + 1,
			day: 12//self.date.getDate()
		})
		.then(function(response) {
			console.log(response);
			self.activeAppointments = response.data;
		}, function(error) {
		})
	}
	self.formatTime = function(time) {
		var firstPart = Math.floor(time);
		var fractionalPart = time - firstPart;
		var minutes = (fractionalPart * 60).toString();
		if (minutes.length < 2) {
			minutes = "0" + minutes;
		}
		return firstPart + ":" + minutes;
	}
	self.refresh();
})
.controller("CreateAppointmentController", function() {
})
.config(function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "login.html",
			controller: "LoginController as login"
		})
		.when("/appointments", {
			templateUrl: "appointments.html",
			controller: "AppointmentsController as appointments"
		})
		.when("/createappointment", {
			templateUrl: "createappointment.html",
			controller: "CreateAppointmentController as createAppointments"
		})
		.otherwise({
			redirectTo: "/"
		});
});
