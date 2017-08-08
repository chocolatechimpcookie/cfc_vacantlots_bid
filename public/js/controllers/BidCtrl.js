 angular.module('vacantlotsApp').controller('BidCtrl',  ['$http', '$state', 'sharedpropertiesService', function($http, $state, sharedpropertiesService)
 {
    console.log('In bid control.');
  	var vm = this;
    vm.bidpropertyAddress = sharedpropertiesService.getProperty()[0];
    vm.bidpropertyLotid = sharedpropertiesService.getProperty()[3];
    vm.bidAverage ="No bids";
    vm.bidAmount;
    console.log(vm.bidpropertyAddress);

    //thinking of keeping this here in case I integrate URL -> bid page
    $http(
    {
        method: 'GET',
        url: '/avgbid/' + vm.bidpropertyLotid,
        data: null,
        headers: {'Authorization': 'JWT ' + localStorage.getItem("token")}
    }).then(function success(res)
    {
        console.log(res.data)
        vm.bidAverage = "$ " + res.data.avg;
        //number of bids (by unique users) is res.data.bids,
        //average of bids is res.data.avg
    }, function err(res)
    {
        console.log(res)
        console.log("error retrieving average bid")
    });

    vm.bid = function()
    {
      $http({
          method: 'POST',
          url: '/bid',
          data: {bid: vm.bidAmount,
                 lotID: vm.bidpropertyLotid},
          headers: {'Authorization': 'JWT ' + localStorage.getItem("token")}
      }).then(function success(res) {
          console.log("response bid");
          console.log(res.data)
          //keeps userInfo up to date
          // $scope.userInfo()
          popupModal("Bid", "Your bid has been successful");
          $state.go('homePage');

      }, function err(res) {
          console.log(res)
          console.log("error bidding")
          popupModal("Bid", "Your bid has not been succesful");

      })
    }

}]);
