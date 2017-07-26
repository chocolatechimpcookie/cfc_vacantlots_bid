angular.module('vacantlotsApp').controller('BidCtrl', function(sharedpropertiesService)
{
    console.log('In bid control.')
  	var vm = this;
    this.property = sharedpropertiesService.getProperty();

    // FIXME: use angular instead
    console.log(this.property)
    document.getElementById("address").innerHTML = this.property;

});
