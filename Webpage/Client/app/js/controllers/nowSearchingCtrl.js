angular.module('myApp.nowSearchingCtrl', []).
    controller('NowSearchingCtrl', function($rootScope, $scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.no_search = true;
    $scope.search = true;
    $scope.result = true;

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
                var d = search.data;
                if (typeof d.response !== 'undefined') {
                    $scope.no_search = false;
                    $scope.searching = true;
                } else {
                    $scope.searching = true;
                    $scope.search = false;
                    $scope.result = false;
                    $scope.web = d.web;
                    $scope.date = d.date;
                    $scope.stype = d.stype;
                    $scope.status = d.status;
                }
            } else
                $scope.no_search = false;
                $scope.searching = true;
        });
    }
});