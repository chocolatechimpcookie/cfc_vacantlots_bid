//console.log("test hamburger outside");
//
angular.module('vacantlotsApp').controller('SidebarController', function()
{
	console.log("test sidebarController");
	this.state = false;
});
//
angular.module('vacantlotsApp').directive('sidebarDirective', function()
{
    console.log("test sidebarDirective");

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

$(document).ready(function()
{
    $("#menu-toggle, .sidebar_links").click(function(e) {
    //$("#menu-toggle").click(function(e) {
        //e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

		// $()

});



// Both of these seem to be doing the same thing
//	But disabling either will cause it not to work
// show is not a class in the index or scss
// why
// maybe one of them is a slide
// not seeing how the slide works
// not seeing how angular applies to this,

//also the hamburger button disappears when you minimize
