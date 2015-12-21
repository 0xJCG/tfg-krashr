'use strict';
 
angular.module('myApp', ['ngRoute', 'myApp.services', 'myApp.mainCtrl', 'myApp.profileCtrl', 'myApp.searchesCtrl', 'myApp.nowSearchingCtrl', 'myApp.signinCtrl', 'myApp.passwordCtrl'])

.directive('search', function() {
	return {
		templateUrl:'templates/directives/search.html'
	};
})

.directive('searches', function() {
	return {
		templateUrl:'templates/directives/searches.html'
	};
})

.directive('vulnerabilities', function() {
	return {
		templateUrl:'templates/directives/vulnerabilities.html'
	};
})

.directive('vulnerability', function() {
	return {
		templateUrl:'templates/directives/vulnerability.html'
	};
})

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/allsearches', {
            templateUrl: 'templates/allsearches.html',
            controller: 'SearchesCtrl'
        }).
        when('/main', {
            templateUrl: 'templates/main.html',
            controller: 'MainCtrl'
        }).
        when('/nowsearching', {
            templateUrl: 'templates/nowsearching.html',
            controller: 'NowSearchingCtrl'
        }).
        when('/profile', {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileCtrl'
        }).
        when('/signin', {
            templateUrl: 'templates/signin.html',
            controller: 'SigninCtrl'
        }).
        when('/updatepassword', {
            templateUrl: 'templates/updatepassword.html',
            controller: 'PasswordCtrl'
        }).
        otherwise({
            redirectTo: '/main'
        });
}])

.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});