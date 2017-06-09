angular.module('vacantlotsApp').controller('BidCtrl', function(sharedpropertiesService)
{
    console.log('In bid control.')
  	var vm = this;
    this.propertyName = sharedpropertiesService.getString();

});
