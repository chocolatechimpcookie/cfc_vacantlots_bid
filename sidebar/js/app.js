/* Adapted from http://devartisans.com/articles/sidebar-navigation-using-angular */

/* global angular */
(function() {
  
var app = angular.module('app', []);

app.controller('SidebarController', function($scope) {
    
    $scope.state = false;
    
    // Just a dummy function to show we are connecting with angular
    $scope.toggleState = function() {
        //$scope.state = !$scope.state;
        console.log('Toggling!!!')
    };
    
});

//TODO: Apply this directive to the bootstrap code.
app.directive('sidebarDirective', function() {
    return {
        link : function(scope, element, attr) {
            console.log(attr)
            scope.$watch(attr.sidebarDirective, function(newVal) {
                  if(newVal)
                  {
                    element.addClass('show'); 
                    return;
                  }
                  element.removeClass('show');
            });
        }
    };
});  
  
  
}())

