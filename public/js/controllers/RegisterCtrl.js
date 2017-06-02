angular.module('vacantlotsApp').controller('RegisterCtrl', ['$http', '$location', function($http, $location)
{
    var vm = this;
    vm.username = "";
    vm.password = "";
    vm.email = "";
    vm.phone = "";




    vm.submit = function()
    {
        console.log("register clicked");
        console.log(vm.password);
        var the_user = vm.username;
        $http(
        {
            method: 'POST',
            url: '/register',
            data:
            {
                firstname: vm.firstName,
                lastname: vm.lastName,
                username: vm.username,
                password: vm.password,
                email: vm.email,
                phone: vm.phone
            }
        }).then(function success(res)
        {
            console.log(res);
            console.log(vm.username);
            console.log(the_user);
            popupModal("Registered.", "You have been registered as " + the_user + ". Please login.");
            $location.path('/');

        }, function err(res)
        {
            console.log(res);
            popupModal("Error has occured.", "Check your username. It is not original");
        });


    };
}]);

    console.log("Test Register Ctrl");
