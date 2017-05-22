app.controller('MainCtrl', function ()
{
    var vm = this;

    //will have to check if this logic works with login and log out
    if (localStorage.getItem('token'))
    {
        vm.logstatus = true;
    }
    else
    {
        vm.logstatus = false;
    }

    vm.logout = function()
    {
        localStorage.removeItem('token');
        vm.logstatus = false;

    };

});
