angular.module('myApp.searchesCtrl', ['ui.bootstrap'])

.controller('SearchesCtrl', function($rootScope, $scope, $location, restClient) {
    /* Hiding the warning DIVs. */
    $scope.no_search = true;

    /* DIV showing searching for an actual vulnerability search. */
    $scope.searching = false;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    /* Changing the menu. */
    $rootScope.menu_sign_in = true;
    $rootScope.menu_profile = true;
    $rootScope.user = JSON.parse(localStorage.getItem('user')).name;

    $scope.searches = {},
    $scope.currentPage = 1,
    $scope.numPerPage = 10,
    $scope.maxSize = 5;

    $scope.getNumberSearches = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getNumberSearches(user.name, user.pass).then(function(number) {
            $scope.totalItems = number.data.length;
        });
    }

    $scope.getNumberSearches();

    $scope.getAllSearches = function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getSearches(user.name, user.pass, 0, 0).then(function(searches) {
            if (Object.keys(searches.data).length > 0) {
                $scope.searching = true;
                $scope.searches = searches.data;
            } else {
                $scope.no_search = false;
                $scope.searching = true;
            }
        });
    }

    $scope.getAllSearches();

    // Pagination: http://plnkr.co/edit/81fPZxpnOQnIHQgp957q?p=preview
    /*$scope.$watch('currentPage + numPerPage', function() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getSearches(user.name, user.pass, $scope.currentPage - 1, $scope.numPerPage).then(function(searches) {
        console.log(searches.data);
            if (searches.data) {
                $scope.searching = true;
                $scope.no_search = true;
                var s = searches.data;
			 	$scope.searches = s;
            } else {
                $scope.no_search = false;
                $scope.searching = true;
            }
        });
    });*/
})