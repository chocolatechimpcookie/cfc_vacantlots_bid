//console.log("test hamburger outside");

app.controller('SidebarController', function()
{
	console.log("test hamburger inside1");
	this.state = false;
});

app.directive('sidebarDirective', function()
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

$(document).ready(function()
    {
        $("#menu-toggle, .sidebar_links").click(function(e) {
        //$("#menu-toggle").click(function(e) {
            //e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });

    });
