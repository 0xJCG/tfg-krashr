angular.module('myApp.profileCtrl', []).
    controller('ProfileCtrl', function($scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.pass = true;
    $scope.impossible = true;
    $scope.r_impossible = true;
    $scope.successful = true;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

	getProfile();

    $scope.getProfile = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getUserData(user.name, user.pass).then(function(profile) {
            if (profile) {
                $scope.user = profile.user;
                $scope.email = profile.email;
                $scope.firstname = profile.firstname;
                $scope.lastname = profile.lastname;
            } else
                $scope.r_impossible = false;
                $scope.pass = true;
                $scope.impossible = true;
                $scope.successful = true;
        });
    }

    $scope.updateProfile = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user.pass == $scope.password) {
            restClient.updateUserInfo(user.name, user.pass).then(function(updated) {
                if (updated) {
                    $scope.successful = false;
                    $scope.pass = true;
                    $scope.impossible = true;
                    $scope.r_impossible = true;
                } else {
                    $scope.impossible = false;
                    $scope.pass = true;
                    $scope.r_impossible = true;
                    $scope.successful = true;
                }
            });
        } else {
            $scope.pass = false;
            $scope.impossible = true;
            $scope.r_impossible = true;
            $scope.successful = true;
        }
    }

    $scope.signOut = function() {
        localStorage.removeItem('user');
        localStorage.clear();
        $location.path('/signin');
    }
});