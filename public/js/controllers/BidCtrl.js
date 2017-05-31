angular.module('vacantlotsApp').controller('BidCtrl', function($scope, sharedProperties)
{
    console.log('In bid control.')
    $scope.propertyName = sharedProperties.getString();

});
