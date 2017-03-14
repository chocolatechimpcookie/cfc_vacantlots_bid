console.log("test hamburger outside");

angular.module('vacantlotsApp').controller('SidebarController', function($scope) 
	{
console.log("test hamburger inside1");
		
		$scope.state = false;
		
		// Just a dummy function to show we are connecting with angular
		$scope.toggleState = function() 
		{
		    //$scope.state = !$scope.state;
		    console.log('Toggling!!!');
		};
		console.log("test hamburger inside1a");

	});

angular.module('vacantlotsApp').directive('sidebarDirective', function()
{
console.log("test hamburger inside 2");

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
