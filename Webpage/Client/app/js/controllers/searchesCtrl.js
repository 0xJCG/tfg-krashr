angular.module('myApp.searchesCtrl', []).
    controller('SearchesCtrl', function($rootScope, $scope, $location, restClient, searchListService) {

    /* Hiding the warning DIVs. */
    $scope.no_search = true;

    /* DIV showing searching for an actual vulnerability search. */
    $scope.searching = false;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    /* Changing the menu. */
    $rootScope.menu_sign_in = true;
    $rootScope.menu_profile = true;

    getAllSearches();

    function getAllSearches() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getAllSearches(user.name, user.pass).then(function(searches) {
            console.log(searches);
            if (searches.data) {
                $scope.searching = true;
                $scope.no_search = false;
                var s = searches.data;
                searchListService.setSearchList(s);
			 	$scope.searches = searches;
            } else
                $scope.no_search = false;
                $scope.searching = true;
        });
    }
});