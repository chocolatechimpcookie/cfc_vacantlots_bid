angular.module('vacantlotsApp')
    .controller('RegisterCtrl', ['$http', function($http)
    {
        this.username = "";
        this.password = "";
        this.email = "";
        this.phone = "";
        
        
        this.submit = function()
        {
            console.log("register clicked");
            console.log(this.password);
            $http(
            {
                method: 'POST',
                url: '/register',
                data:
                {
                    name: this.name,
                    username: this.password,
                    email: this.email,
                    phone: this.phone
                }
            }).then(function success(res)
            {
               console.log(res);
            }), function err(res)
            {
                console.log(res);
            }
            
            
        };
    }]);
    
    console.log("Test Register Ctrl");