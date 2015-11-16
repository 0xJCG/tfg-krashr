angular.module('myApp.profileCtrl', []).
    controller('ProfileCtrl', function($scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");

	// $scope.profile();

    $scope.getProfile = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getNotes(user.name, user.pass).then(function(profile) {
            if (profile.data)
                ;
            else
                ;
		 });
	 }
});