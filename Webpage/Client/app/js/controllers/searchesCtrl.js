angular.module('myApp.searchesCtrl', []).
    controller('SearchesCtrl', function($scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");
});