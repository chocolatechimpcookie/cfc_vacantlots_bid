// console.log("this is app variable in account service");

angular.module('vacantlotsApp').service('accountService', function()
{

  if(localStorage.getItem('token'))
  {
    var logStatus = true;

  }

  else
  {
    var logStatus = false;
  }



  return {
    setLogin: function()
    {
      logStatus = true;
    },

    setLogout: function()
    {
      console.log("Log out");
      localStorage.removeItem('token');
      logStatus = false;

    },

    getLogstatus: function()
    {
      return logStatus;

    }


  }


});
