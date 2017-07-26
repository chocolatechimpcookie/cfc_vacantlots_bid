angular.module('vacantlotsApp').controller('MainCtrl', function (accountService)
{
  var vm = this;
  vm.accountService = accountService;
  console.log("Log status");
  console.log(vm.accountService.getLogstatus());

});
