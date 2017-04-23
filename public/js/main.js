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



    }])
    // The service below allows us to share variables between controllers
    // Based on http://jsfiddle.net/b2fCE/1/
    .service('sharedProperties', function() {
    var objectValue = {
        data: 'not found'
    };

    return {
        getString: function() {
            return objectValue.data;
        },
        setString: function(value) {
            console.log('Setting string through shared object');
            objectValue.data = value;
        },
        getObject: function() {
            return objectValue;
        }
    }
});

    ;
    
//    
//$(function()
//{
//    //$("#myModal").show();
//    $("#myModal").modal('show');
//    console.log("shown");
//});
//How do I implement multiple module configs?

//    .config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $urlRouterProvider)
    //{
