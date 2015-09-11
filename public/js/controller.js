var boilerplate = angular.module('boilerplate', ["ngRoute", "firebase", "ui.bootstrap"]);


//routing happens here
socialMediaApp.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/landing', {
            templateUrl: '/templates/landing.html',
            controller: 'landingController'
        })
        .otherwise({
            redirectTo: "/landing"
        });

}]);

socialMediaApp.controller('landingController', function ($scope, $firebaseObject, profileService, $location, $route) {
    var base = new Firebase("https://allofus.firebaseio.com/");
});

