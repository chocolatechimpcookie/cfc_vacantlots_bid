angular.module('vacantlotsApp', ['ui.router', 'uiGmapgoogle-maps'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise('/');
        $stateProvider
        .state('home',
        {
            url:'/',
            templateUrl:'views/map.html',
            controller: "MapCtrl as map"
        })
        ;
    }])
    
    
    
    
    
    ;
    
//How do I implement multiple module configs?