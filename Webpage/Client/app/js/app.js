'use strict';
 
angular.module('myApp', ['ngRoute', 'myApp.mainCtrl', 'myApp.profileCtrl', 'myApp.searchesCtrl', 'myApp.signinCtrl']).

config(['$routeProvider', function($routeProvider) {
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
            controller: 'SearchesCtrl'
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
            controller: 'ProfileCtrl'
        }).
        otherwise({
            redirectTo: '/main'
        });
}]);