angular.module('myApp.profileCtrl', []).
    controller('ProfileCtrl', function($scope, $location, restClient) {

    if (!localStorage.getItem("user"))
        $location.path("/signin");
	
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
                            ;
                        }
                    });
                } else { // Contraseña antigua no coincide.
                    ;
                }
            } else { // Nuevas contraseñas no coinciden.
                ;
            }
        } else { // Algún campo vacío.
            ;
        }
    }

    $scope.getProfile = function() {
        ;
    }
});