var boilerplate = angular.module('boilerplate', ["ngRoute", "firebase", "ui.bootstrap"]);


//routing happens here
boilerplate.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/landing', {
            templateUrl: '/templates/landing.html',
            controller: 'landingController'
        })
        .otherwise({
            redirectTo: "/landing"
        });

}]);

boilerplate.service('vizService',function(){

		var service = this;
	    this.chartDivID = "chart";

	    this.chartWidth = $("#"+this.chartDivID).width();
		this.chartHeight = $(window).height()/1.3;

		this.svg = function(selector,spec){
			d3.select(selector).selectAll("svg").remove();
			return d3.select(selector).append("svg")	
				.attr({
					"width":service.chartWidth,
					"height":service.chartHeight
				});
		}

		this.drawRect = function(d3sel){
			d3sel.append("rect")
				.attr({
					"width":d3sel.attr("width"),
					"height":d3sel.attr("height")
				});
		}

});

boilerplate.controller('landingController', function ($scope, $firebaseObject, $location, $route,vizService,$window) {
	var baseURL = "analyzetester";
    var base = new Firebase("https://"+baseURL+".firebaseio.com/");
	var info = $firebaseObject(base.child("info"));
	
	info.$bindTo($scope, "info");

	var chart = vizService.svg("#"+vizService.chartDivID,{width:vizService.chartWidth,height:500})

	vizService.drawRect(chart);

	var w = angular.element($window);

	w.bind('resize',function () {
		chart.attr({
				"width":$("#"+vizService.chartDivID).width(),
				"height":$(window).height()/2,
		});
	});

});

