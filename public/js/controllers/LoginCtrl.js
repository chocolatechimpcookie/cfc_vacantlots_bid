angular.module('vacantlotsApp')
    .controller('LoginCtrl', ['$http',  function($http)
    {
      var vm = this;

      vm.username = "";
      vm.password = "";
      vm.message = "";

      vm.login = function()
      {
        $http
        ({
            method:'POST',
            url: '/login',
            data:
            {
              username: vm.username,
              password: vm.password
            }
        }).then (function success(response)
        {
          if (response.token)
          {
            console.log("Token recieved");
            localStorage.setItem("token", data.token);
          }
          else
          {
            console.log("There's no Token");
          }
        }, function err(response)
        {
          console.log('error');
          console.log(response);
        });

      }
    }]);
