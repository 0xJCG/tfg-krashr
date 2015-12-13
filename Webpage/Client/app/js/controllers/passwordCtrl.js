angular.module('myApp.passwordCtrl', []).
    controller('PasswordCtrl', function($rootScope, $scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");

    /* Changing the menu. */
    $rootScope.menu_sign_in = true;
    $rootScope.menu_profile = true;

	/* Hiding the warning DIVs. */
    $scope.data = true;
    $scope.newpass = true;
    $scope.oldpass = true;
    $scope.updatepass = true;
    $scope.successful = true;

    $scope.helpPass = function() {

    }

    $scope.helpPass2 = function() {

    }

    $scope.updatePassword = function() {
        var oldPass = $scope.oldpass;
        var newPass = $scope.newpass;
        var repPass = $scope.reppass;

        if (oldPass !== undefined && newPass !== undefined && repPass !== undefined) { // Campos no vacíos.
            if (newPass == repPass) { // Los campos de la nueva contraseña coinciden.
                oldPass = sha512(oldPass);
                var user = JSON.parse(localStorage.getItem("user"));

                if (oldPass === user.pass) {
                    restClient.updatePassword(user.name, oldPass, sha512(newPass)).
                    then(function(updated) {
                        if (updated) {
                            user.pass = sha512(newPass);
                            localStorage.setItem("user", JSON.stringify(user));
                            $scope.data = true;
                            $scope.newpass = true;
                            $scope.oldpass = true;
                            $scope.updatepass = true;
                            $scope.successful = false;
                        } else {
                            $scope.data = true;
                            $scope.newpass = true;
                            $scope.oldpass = true;
                            $scope.updatepass = false;
                            $scope.successful = true;
                        }
                    });
                } else { // Contraseña antigua no coincide.
                    $scope.data = true;
                    $scope.newpass = true;
                    $scope.oldpass = false;
                    $scope.updatepass = true;
                    $scope.successful = true;
                }
            } else { // Nuevas contraseñas no coinciden.
                $scope.data = true;
                $scope.newpass = false;
                $scope.oldpass = true;
                $scope.updatepass = true;
                $scope.successful = true;
            }
        } else { // Algún campo vacío.
            $scope.data = false;
            $scope.newpass = true;
            $scope.oldpass = true;
            $scope.updatepass = true;
            $scope.successful = true;
        }
    }
});