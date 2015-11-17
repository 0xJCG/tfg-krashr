angular.module('myApp.profileCtrl', []).
    controller('ProfileCtrl', function($scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.pass = true;
    $scope.impossible = true;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

	//$scope.getProfile();

    $scope.getProfile = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getNotes(user.name, user.pass).then(function(profile) {
            if (profile.data)
                ;
            else
                ;
        });
    }

    $scope.signOut = function() {
        localStorage.removeItem('user');
        localStorage.clear();
        $location.path('/signin');
    }
});