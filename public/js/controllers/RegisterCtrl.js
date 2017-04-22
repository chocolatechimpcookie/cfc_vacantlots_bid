angular.module('vacantlotsApp')
    .controller('RegisterCtrl', ['$http', '$location', function($http, $location)
    {
        this.username = "";
        this.password = "";
        this.email = "";
        this.phone = "";


        this.submit = function()
        {
            console.log("register clicked");
            console.log(this.password);
            var the_user = this.username;
            $http(
            {
                method: 'POST',
                url: '/register',
                data:
                {
                    name: this.name,
                    username: this.username,
                    password: this.password,
                    email: this.email,
                    phone: this.phone
                }
            }).then(function success(res)
            {
               console.log(res);
               console.log(this.username);
               console.log(the_user);
                alert("You have now been registered as" + the_user +  "You will now be redirected to login.");
                $location.path('/login');

            }, function err(res)
            {
                console.log(res);
                alert("There was an error. Your username is likely taken.");
            });
            
            
        };
    }]);
    
    console.log("Test Register Ctrl");