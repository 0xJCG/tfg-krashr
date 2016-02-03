angular.module('myApp.profileCtrl', []).
    controller('ProfileCtrl', function($rootScope, $scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    /* Changing the menu. */
    $rootScope.menu_sign_in = true;
    $rootScope.menu_profile = true;
    $rootScope.user = JSON.parse(localStorage.getItem('user')).name;

    /* Hiding the warning DIVs. */
    $scope.pass = true;
    $scope.impossible = true;
    $scope.r_impossible = true;
    $scope.successful = true;
    $scope.in_data = true;

    getProfile();

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
                $scope.in_data = true;
        });
    }

    $scope.updateProfile = function() {
        if (!$scope.firstname || !$scope.lastname || !$scope.password) {
            $scope.pass = true;
            $scope.impossible = true;
            $scope.r_impossible = true;
            $scope.successful = true;
            $scope.in_data = false;
        } else {
            var user = JSON.parse(localStorage.getItem('user'));
            var pass = sha512($scope.password)
            if (user.pass == pass) {
                restClient.updateUserInfo(user.name, user.pass, $scope.firstname, $scope.lastname, $scope.email).then(function(updated) {
                    if (updated) {
                        $scope.successful = false;
                        $scope.pass = true;
                        $scope.impossible = true;
                        $scope.r_impossible = true;
                        $scope.in_data = true;
                    } else {
                        $scope.impossible = false;
                        $scope.pass = true;
                        $scope.r_impossible = true;
                        $scope.successful = true;
                        $scope.in_data = true;
                    }
                });
            } else {
                $scope.pass = false;
                $scope.impossible = true;
                $scope.r_impossible = true;
                $scope.successful = true;
                $scope.in_data = true;
            }
        }
    }

    $scope.signOut = function() {
        localStorage.removeItem('user');
        localStorage.clear();
        $location.path('/signin');
    }
});