angular.module('myApp.passwordCtrl', []).
    controller('PasswordCtrl', function($scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");

	/* Hiding the warning DIVs. */
    $scope.data = true;
    $scope.newpass = true;
    $scope.oldpass = true;
    $scope.updatepass = true;

    $scope.updatePassword = function() {
        var oldPass = $scope.oldpass;
        var newPass = $scope.newpass;
        var repPass = $scope.reppass;

        if (oldPass !== undefined && newPass !== undefined && repPass !== undefined) { // Campos no vacíos.
            if (newPass == repPass) { // Los campos de la nueva contraseña coinciden.
                oldPass = sha512(oldPass);
                var user = JSON.parse(localStorage.getItem("user"));

                if (oldPass === user.pass) {
                    restClient.changePass(user.name, oldPass, sha512(newPass)).
                    then(function(updated) {
                        if (updated) {
                            user.pass=sha512(newPass);
                            localStorage.setItem("user", JSON.stringify(user));
                        } else {
                            $scope.updatepass = false;
                        }
                    });
                } else { // Contraseña antigua no coincide.
                    $scope.oldpass = false;
                }
            } else { // Nuevas contraseñas no coinciden.
                $scope.newpass = false;
            }
        } else { // Algún campo vacío.
            $scope.data = false;
        }
    }
}