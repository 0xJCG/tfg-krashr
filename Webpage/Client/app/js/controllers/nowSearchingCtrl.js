angular.module('myApp.nowSearchingCtrl', []).
    controller('NowSearchingCtrl', function($rootScope, $scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.no_search = true;
    $scope.search = true;

    /* DIV showing searching for an actual vulnerability search. */
    $scope.searching = false;

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    /* Changing the menu. */
    $rootScope.menu_sign_in = true;
    $rootScope.menu_profile = true;

    getActualSearch();

    function getActualSearch() {
        var user = JSON.parse(localStorage.getItem('user'));
        restClient.getActualSearch(user.name, user.pass).then(function(search) {
            if (search.data) {
                $scope.searching = true;
                $scope.search = false;
                var search = search.data;
                $scope.web = search.WEB;
                $scope.date = search.DATE;
            } else
                $scope.no_search = false;
                $scope.searching = true;
        });
    }
});