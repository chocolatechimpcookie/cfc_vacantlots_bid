

angular.controller('SidebarController', function($scope) 
	{
		
		$scope.state = false;
		
		// Just a dummy function to show we are connecting with angular
		$scope.toggleState = function() 
		{
		    //$scope.state = !$scope.state;
		    console.log('Toggling!!!');
		};
		
	});

angular.directive('sidebarDirective', function()
{
    return {
        link : function(scope, element, attr)
        {
            console.log(attr);
            scope.$watch(attr.sidebarDirective, function(newVal)
            {
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
