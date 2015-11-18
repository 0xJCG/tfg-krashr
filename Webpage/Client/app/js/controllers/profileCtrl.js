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

    //$scope.getProfile =

    function getProfile() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getUserInfo(user.name, user.pass).then(function(profile) {
            if (profile.data) {
                var userdata = profile.data;
                $scope.user = userdata.USERNAME;
                $scope.email = userdata.EMAIL;
                $scope.firstname = userdata.NAME;
                $scope.lastname = userdata.LASTNAME;
            } else
                $scope.r_impossible = false;
                $scope.pass = true;
                $scope.impossible = true;
                $scope.successful = true;
        });
    }

    $scope.updateProfile = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        var pass = sha512($scope.password)
        if (user.pass == pass) {
            restClient.updateUserInfo(user.name, user.pass, $scope.email, $scope.firstname, $scope.lastname).then(function(updated) {
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