angular.module('myApp.mainCtrl', []).
    controller('MainCtrl', function($scope, $location, restClient) {

    /* Hiding the warning DIVs. */
    $scope.web = true;
    $scope.wrong = true;
    $scope.problem = true;

    $scope.search = function() {
        if (!localStorage.getItem("user")) {
            $scope.web = false;
            $scope.wrong = true;
            $scope.problem = true;
        } else {
            var user = JSON.parse(localStorage.getItem("user"));
            var web = $scope.websearch;
            if (!isUrl(web)) {
                $scope.wrong = false;
                $scope.web = true;
                $scope.problem = true;
            } else {
                restClient.search(user.name, user.pass, web).
                then(function(searching) {
                    if (searching) {
                        $location.path("/nowsearching");
                    } else {
                        $scope.problem = false;
                        $scope.web = true;
                        $scope.problem = true;
                    }
                });
            }
        }
    }

    function isUrl(url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(url);
    }
});