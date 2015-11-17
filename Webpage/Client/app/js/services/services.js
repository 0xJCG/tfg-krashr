angular.module('myApp.services', [])

.service('restClient', function($http) {
	//url para la conexion al servidor
	//var direccion = 'http://192.168.1.43:3000';//debug
	var direction = 'http://localhost:3000';//debug

	this.signin = function(USERNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;

		var promise = $http.post(direction + '/signin', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.signup = function(USERNAME, EMAIL, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;
		request.EMAIL = EMAIL;

		var promise = $http.post(direction + '/signup', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.updatePassword = function(USERNAME, OLD, NEW) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.OLD = OLD;
		request.NEW = NEW;

		var promise = $http.post(direction + '/updatepass', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.updateUserInfo = function(USERNAME, PASSWORD, FIRSTNAME, LASTNAME, EMAIL, BIRTHDATE) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;
		request.FIRSTNAME = FIRSTNAME;
		request.LASTNAME = LASTNAME;
		request.EMAIL = EMAIL;
		request.BIRTHDATE = BIRTHDATE;

		var promise = $http.post(direction + '/profile', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.getUserInfo = function(USERNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;

		var promise = $http.post(direction + '/getUserInfo', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}
});