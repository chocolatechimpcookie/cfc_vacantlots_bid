/*Adapted from http://devartisans.com/articles/sidebar-navigation-using-angular*/

/* global angular */
(function() {
  
var app = angular.module('app', []);

app.controller('SidebarController', function($scope) {
    
    $scope.state = false;
    
    $scope.toggleState = function() {
        $scope.state = !$scope.state;
    };
    
});

// TODO: Learn how these directives work
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

