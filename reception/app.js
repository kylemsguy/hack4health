angular.module("app", ["ngRoute", ])
.controller("LoginController", function($location) {
	var login = this;
	login.submit = function() {
		$location.path("/appointments");
	}
})
.controller("AppointmentsController", function() {
	var appointments = this;
	appointments.activeAppointments = [{
		id: "1234",
		time: "9:30",
		name: "Example",
		distance: "1.234 km"
	}];
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
		.otherwise({
			redirectTo: "/"
		});
});
