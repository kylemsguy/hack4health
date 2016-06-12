var BACKEND_URL="https://hack4health-cherylyli.c9users.io";
var AUTO_REFRESH = false;
angular.module("app", ["ngRoute", "ngResource", "ngCookies"])
.controller("LoginController", function($rootScope, $location, $cookies) {
	var login = this;
	login.submit = function() {
		$cookies.put("clinicName", login.loginData.clinicName);
		$location.path("/appointments");
	}
	login.clinicNames = ["Markham Family Health Team", "St Michaels Health Centre", "Mt Pleasant Family Practice", "Church Wellesley Medical Clinic"];
	login.loginData = {clinicName: $cookies.get("clinicName")? $cookies.get("clinicName"): login.clinicNames[0]};
})
.controller("AppointmentsController", function($scope, $rootScope, $location, $http, $cookies) {
	var self = this;
	$scope.activeAppointments = [];
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
			$scope.activeAppointments = response.data;
		}, function(error) {
			console.log(error);
			alert("Failed to load data: please refresh the page");
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
	self.checkIn = function(app) {
		$http.post(BACKEND_URL + "/checkIn", {
			clinicName: self.clinicName,
			appid: app.appid
		});
		app.checkedIn = true;
		self.refresh();
	};
	self.endApp = function(app) {
		$http.post(BACKEND_URL + "/endApp", {
			clinicName: self.clinicName,
			appid: app.appid
		});
		console.log(app);
		var index = $scope.activeAppointments.indexOf(app);
		$scope.activeAppointments.splice(index, 1);
		self.refresh();
	};
	self.refresh();
	var timer = AUTO_REFRESH? setInterval(function() {
		self.refresh();
	}, 10000): undefined;
	$scope.$on("$destroy", function() {
		if (timer) {
			clearTimeout(timer);
		}
	});
})
.controller("CreateAppointmentController", function($scope, $http, $cookies, $location) {
	$scope.email = "";
	$scope.doctorName = "";
	$scope.appointmentDate = new Date();
	$scope.time = "9";
	$scope.estimateTime = 20;
	function parseTime(s) {
		if (s.indexOf(":") == -1) return parseInt(s, 10);
		var a = s.split(":");
		return parseInt(a[0], 10) + (parseInt(a[1], 10)/60);
	}
	$scope.submitAppointment = function() {
		$http.post(BACKEND_URL + "/newAppointment", {
			email: $scope.email,
			clinicName: $cookies.get("clinicName"),
			doctorName: $scope.doctorName,
			month: $scope.appointmentDate.getMonth() + 1,
			day: $scope.appointmentDate.getDate(),
			year: $scope.appointmentDate.getFullYear(),
			time: parseTime($scope.time),
			estimateTime: $scope.estimateTime
		}).then(function(response) {
			alert("Appointment saved.");
		}, function(error) {
			console.log(error);
			alert("Unable to save appointment.");
		});
	};
	$scope.goBack = function() {
		$location.path("/appointments");
	};
	$scope.set27hours = function() {
		$scope.appointmentDate = new Date(Date.now() + 27*60*60*1000);
		$scope.time = $scope.appointmentDate.getHours() + ":" +
			($scope.appointmentDate.getMinutes() < 10? "0": "") +
			$scope.appointmentDate.getMinutes();
	}
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
