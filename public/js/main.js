
// holds any global variables or functions

// var app = angular.module('vacantlotsApp');




angular.module('vacantlotsApp', ['ui.router', 'uiGmapgoogle-maps'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)
{
    //.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider)
//{
    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);
    //$locationProvider.html5Mode({ enabled: true, requireBase: false });
    $stateProvider
    .state('homePage',
    {
        url:'/',
        templateUrl:'views/map.html',
        controller: "MapCtrl as map"
    })
.state('loginPage',
{
	url:'/login',
	templateUrl:'views/login.html',
	controller: "LoginCtrl as login"
})
.state('registerPage',
{
	url:'/register',
	templateUrl:'views/register.html',
	controller: "RegisterCtrl as register"
})
.state('bidPage',
{
	url:'/bid_page',
	templateUrl:'views/bid_page.html',
	controller: "BidCtrl as bid"
})
    ;



}]);


function popupModal(header, message)
{
    $(function()
    {
        //$("").show();
        //$("#modal_text_header").html("Error has occured");
        //$("#modal_text_body").html("Check your username. It is likely not original");
        document.getElementById("modal_text_header").innerHTML = header;
        document.getElementById("modal_text_body").innerHTML = message;
        $("#popup_modal").modal('show');
        console.log("shown");

    });
}
