 angular.module('vacantlotsApp').controller('BidCtrl',  ['$http', 'sharedpropertiesService', function($http, sharedpropertiesService)
 {
    console.log('In bid control.');
  	var vm = this;
    vm.bidpropertyAddress = sharedpropertiesService.getProperty()[0];
    vm.bidpropertyLotid = sharedpropertiesService.getProperty()[3];
    vm.bidAverage ="No bids";
    vm.bidAmount;
    console.log(vm.bidpropertyAddress);

    $http(
    {
        method: 'GET',
        url: '/avgbid/' + vm.bidpropertyLotid,
        data: null,
        headers: {'Authorization': 'JWT ' + localStorage.getItem("token")}
    }).then(function success(res)
    {
        console.log(res.data)
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
          data: {bid: $scope.bidAmount,
                 lotID: lots[Math.floor(Math.random() * lots.length)]['lotID']},
          headers: {'Authorization': 'JWT ' + localStorage.getItem("token")}
      }).then(function success(res) {
          console.log(res.data)
          //keeps userInfo up to date
          $scope.userInfo()
      }, function err(res) {
          console.log(res)
          console.log("error bidding")
      })
    }

}]);
