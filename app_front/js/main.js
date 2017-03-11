angular.module('vacantlots', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise('/');
        $stateProvider
        .state('home',
        {
            url:'/',
            templateUrl:'views/map.html',
            //controller
        })
        ;
    }]);