angular.module('vacantlotsApp').controller('BidCtrl', function(sharedpropertiesService)
{
    console.log('In bid control.')
  	var vm = this;
    vm.propertyaddress = sharedpropertiesService.getProperty();
    console.log(vm.propertyaddress);

});
