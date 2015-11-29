angular.module('myApp.searchesCtrl', []).
    controller('SearchesCtrl', function($scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.no_search = true;

    /* DIV showing searching for an actual vulnerability search. */
    $scope.searching = false;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    getAllSearches();

    function getAllSearches() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getAllSearches(user.name, user.pass).then(function(searches) {
            if (searches.data) {
                $scope.searching = true;
                var searches = searches.data;
                searchListService.setSearchList(searches);
			 	$scope.searches = searches;
            } else
                $scope.no_search = false;
                $scope.searching = true;
        });
    }
});