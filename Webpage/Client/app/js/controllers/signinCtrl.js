angular.module('myApp.signinCtrl', []).
    controller('SigninCtrl', function($scope, $location, restClient) {

    var oldUsr = JSON.parse(localStorage.getItem("user"));
    if (oldUsr)
        $location.path("/profile");

    /* Hiding the warning DIVs. */
    $scope.in_data = true;
    $scope.in_impossible = true;

    $scope.up_data = true;
    $scope.up_pass = true;
    $scope.up_impossible = true;
    $scope.up_email = true;

    $scope.signin = function() {
        var name = $scope.user === undefined ? null : $scope.user;
        var pass = $scope.pass === undefined ? null : $scope.pass;

        if (name && pass) {
            pass = sha512(pass);
            var promise = restClient.signin(name,pass);
            promise.then(function(logged) {
                if (logged.data) {
                    var user = new Object();
                    user.name = name;
                    user.pass = pass;
                    user.logged = true;
                    localStorage.setItem("user", JSON.stringify(user));
                    $location.path("/main");
                } else {
                    $scope.in_impossible = false;
                    $scope.in_data = true;
                }
            });
        } else {
            $scope.in_data = false;
            $scope.in_impossible = true;
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
            if (isEmail(email)) {
                pass = sha512(pass);
                repPass = sha512(repPass);
                if (pass == repPass) { // Los campos de la nueva contraseña coinciden.
                    var promise = restClient.signup(name, email, fname, lname, pass);
                    promise.then(function(signedup) {
                        if (signedup.data) { // All OK.
                            var user = new Object();
                            user.name = name;
                            user.pass = pass;
                            user.logged = true;
                            localStorage.setItem("user", JSON.stringify(user));
                            $location.path("/profile");
                        } else { // Mostrar pop up.
                            $scope.up_impossible = false;
                            $scope.up_data = true;
                            $scope.up_pass = true;
                            $scope.up_email = true;
                        }
                    });
                } else { // Nuevas contraseñas no coinciden.
                    $scope.up_pass = false;
                    $scope.up_data = true;
                    $scope.up_impossible = true;
                    $scope.up_email = true;
                }
            } else { // Email not valid.
                $scope.up_data = true;
                $scope.up_pass = true;
                $scope.up_impossible = true;
                $scope.up_email = false;
            }
        } else { // Algún campo vacío.
	        $scope.up_data = false;
            $scope.up_pass = true;
            $scope.up_impossible = true;
            $scope.up_email = true;
        }
    }

    function isEmail(email) {
        var regexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regexp.test(email);
    }
});