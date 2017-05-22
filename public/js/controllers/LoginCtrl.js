angular.module('vacantlotsApp').controller('LoginCtrl', ['$http', '$location',  function($http, $location)
{
  var vm = this;

  vm.username = "";
  vm.password = "";
  vm.message = "";

  vm.submit = function()
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
      console.log("You have been logged in");
      console.log(response);
      if (response.data.token)
      {
        console.log("Token recieved");
        localStorage.setItem("token", response.data.token);
        $location.path('/home');

      }
      else
      {
        console.log("There's no Token");
      }
    }, function err(response)
    {
      console.log('error');
      console.log(response);
      popupModal("Error has occured.", "Check your username and password.");
    });

  };
}]);
