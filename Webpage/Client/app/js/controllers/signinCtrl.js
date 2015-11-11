angular.module('myApp.signinCtrl', []).
    controller('SigninCtrl', function($scope, $location, restClient) {

    var oldUsr = JSON.parse(localStorage.getItem("user"));
    if (oldUsr)
        $location.path("/profile");

    $scope.signin = function() {
        var name = $scope.user === undefined ? null : $scope.user;
        var pass = $scope.pass === undefined ? null : $scope.pass;

        if (name && pass) {
            pass = sha512(pass);
            var promise = restClient.login(name,pass);
            promise.then(function(logged) {
                if (logged.data) {
                    var user = new Object();
                    user.name = name;
                    user.pass = pass;
                    user.logged = logged;
                    localStorage.setItem("user", JSON.stringify(user));
                    $location.path("/main");
                } else {
                    ;
                }
            });
        } else {
            ;
        }
    }

    $scope.signup = function() {
        var name = $scope.username;
        var email = $scope.email;
        var fname = $scope.firstname;
        var lname = $scope.lastname;
        var pass = $scope.password;
        var repPass = $scope.password2;

        if (name !== undefined && pass !== undefined && repPass !== undefined && email !== undefined && fname !== undefined && lname !== undefined) { // Campos no vacíos.
            pass = sha512(pass);
            repPass = sha512(repPass);
            if (pass == repPass) { // Los campos de la nueva contraseña coinciden.
                var promise = restClient.signup(name, email, fname, lname, pass);
                promise.then(function(signedup) {
                    if (signedup.data) { // All OK.
                        var user = new Object();
                        user.name = name;
                        user.pass = pass;
                        user.logged = logged;
                        localStorage.setItem("user", JSON.stringify(user));
                        $location.path("/profile");
                    } else { // Mostrar pop up.
                        ;
                    }
                });
	        } else { // Nuevas contraseñas no coinciden.
	        	;
	        }
        } else { // Algún campo vacío.
	        ;
        }
    }
});