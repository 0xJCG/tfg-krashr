angular.module('myApp.searchesCtrl', [])

.controller('SearchesCtrl', function($rootScope, $scope, $location, restClient) {
    /* http://jsfiddle.net/2ZzZB/56/ */
    $scope.currentPage = 0;
    $scope.pageSize = 10;

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
            if (searches.data) {
                $scope.searching = true;
                var s = searches.data;
                console.log(s);
                //searchListService.setSearchList(s);
			 	$scope.searches = s;
            } else {
                $scope.no_search = false;
                $scope.searching = true;
            }
        });
    }
})