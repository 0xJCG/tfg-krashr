angular.module('myApp.mainCtrl', []).
    controller('MainCtrl', function($scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.web = true;

    $scope.search = function() {
        if (!localStorage.getItem("user"))
            $scope.web = false;
        else
            ;
    }
});