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

	this.signup = function(USERNAME, EMAIL, FIRSTNAME, LASTNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;
		request.EMAIL = EMAIL;
		request.FIRSTNAME = FIRSTNAME;
		request.LASTNAME = LASTNAME;

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

		var promise = $http.post(direction + '/updatepassword', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.updateUserInfo = function(USERNAME, PASSWORD, FIRSTNAME, LASTNAME, EMAIL) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;
		request.FIRSTNAME = FIRSTNAME;
		request.LASTNAME = LASTNAME;
		request.EMAIL = EMAIL;

		var promise = $http.post(direction + '/updateprofile', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.getUserInfo = function(USERNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;

		var promise = $http.post(direction + '/getprofile', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.search = function(USERNAME, PASSWORD, URL) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;
		request.URL = URL;

		var promise = $http.post(direction + '/search', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.getAllSearches = function(USERNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;

		var promise = $http.post(direction + '/results', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}

	this.getActualSearch = function(USERNAME, PASSWORD) {
		var request = new Object();

		request.USERNAME = USERNAME;
		request.PASSWORD = PASSWORD;

		var promise = $http.post(direction + '/currentresult', request).success(function(validation) {
			return(validation);
		});

		return(promise);
	}
})

.service('searchListService',function() {
	this.searchList = [];
	this.vulnerabilityList = [];

	this.getSearchIndex = function(index) {
		if (this.searchList.length > index)
			return this.searchList[index];
		else
		    return null;
	}

	this.getVulnerabilityIndex = function(index) {
		if (this.vulnerabilityList.length > index)
			return this.vulnerabilityList[index];
		else
		    return null;
	}

	this.getSearchList = function() {
		return this.searchList;
	}

	this.getVulnerabilityList = function() {
		return this.vulnerabilityList;
	}

	this.setSearchList = function(searches){
		this.searchList = searches;
		this.vulnerabilityList = searches.vulnerabilities;
	}
});