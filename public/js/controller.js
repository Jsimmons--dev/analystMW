var boilerplate = angular.module('boilerplate', ["ngRoute", "firebase", "ui.bootstrap"]);

boilerplate.value('url', 'analyzetester');


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

boilerplate.service('vizService', function () {

    var service = this;
    this.chartDivID = "chart";

    this.chartWidth = $("#" + this.chartDivID)
        .width();
    this.chartHeight = $(window)
        .height() / 1.3;

    this.svg = function (selector, spec) {
        d3.select(selector)
            .selectAll("svg")
            .remove();
        return d3.select(selector)
            .append("svg")
            .attr({
                "width": service.chartWidth,
                "height": service.chartHeight
            });
    }

    this.drawRect = function (d3sel) {
        d3sel.append("rect")
            .attr({
                "width": d3sel.attr("width"),
                "height": d3sel.attr("height"),
            });
    }

});


boilerplate.service('malwareService', ['url', function (url) {

    var base = new Firebase("https://" + url + ".firebaseio.com/");

    var malwareUrl = "malware";

    this.addMalware = function (name, value) {
        base.child(malwareUrl)
            .push({
                name: name,
                intensity: value
            });
    }


    this.loadSampleMW = function (num) {
        for (var i = 0; i < num; i++) {
            var randomMD5 = (Math.floor((Math.random() + 1) * 1000000000))
                .toString(16);
            var randomIntensity = Math.floor(Math.random() * 1000);
            this.addMalware(randomMD5, randomIntensity);
        }
    }
}]);

boilerplate.controller('landingController', function ($scope, $firebaseObject, $location, $route, vizService, $window, malwareService) {
    var baseURL = "analyzetester";
    var base = new Firebase("https://" + baseURL + ".firebaseio.com/");
    var info = $firebaseObject(base.child("info"));

    info.$bindTo($scope, "info");


    var chart = vizService.svg("#" + vizService.chartDivID, {
        width: vizService.chartWidth,
        height: 500
    })

    var w = angular.element($window);

    w.bind('resize', function () {
        chart.attr({
            "width": $("#" + vizService.chartDivID)
                .width(),
            "height": $(window)
                .height() / 2,
        });
    });


    malwarePack = d3.layout.pack()
        .size([chart.attr("width") * .75, chart.attr("height") * .75])
        .value(function (d) {
            return d.intensity;
        })
        .children(function (d) {
            return d.children;
        })
        .padding(4)

    var root = {
        "name": "root"
    };
    root.children = [];

    var lastUpdate = 0;

    var diameter = 960,
        format = d3.format(",d");

    var updateMalwarePack = function () {

        this.malware && this.malware.remove();


        var nodes = malwarePack.nodes(root);

        this.malware = chart.datum(root)
            .selectAll(".nodes")
            .data(malwarePack.nodes)
            .enter()
            .append("g")
            .attr("class", function (d) {
                return d.children ? "root node" : "leaf node";
            })
            .attr("transform", function (d) {
                return "translate(" +
                    (d.x + (chart.attr("width")*.125)) +
				   	"," +
                    (d.y + chart.attr("height")*.125) +
                    ")";
            })


        var color = d3.scale.linear()
            .domain([0, 1000])
            .range([d3.rgb("green"), d3.rgb("red")]);

        malware.append("title")
            .text(function (d) {
                return d.name + (d.children ? "" : ": " + format(d.intensity));
            });

        malware.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style({
                "opacity": function (d) {
                    return d.children ? .25 : 1
                },
                "fill": function (d) {
                    return d.children ? "none" : color(d.intensity);
                },
                "stroke": "black",
                "stroke-width": function (d) {
                    return  d.children ? 0 : 1.1
                }
            });
    }


	var analystRadius = Math.min(chart.attr("width"),chart.attr("height")) / 2;
	var	analystData = [
		{"name":"John",worth:100},
		{"name":"Corey",worth:1000},
		{"name":"John",worth:423},
		{"name":"Teague",worth:1000}]


var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
	.domain([0,analystData.length-1])

	var arc = d3.svg.arc()
			.outerRadius(analystRadius)
			.innerRadius(analystRadius - 25)

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.worth})
			.padAngle(.05)

			
	var analystRing = chart.selectAll(".arc")
		.data(pie(analystData))
		.enter().append("g")
		.attr({
				"class":"arc",
				"transform":"translate("+chart.attr("width")/2+","+chart.attr("height")/2+")"
		})

	analystRing.append("path")
		.attr("d",arc)
		.style({
				"fill":function(d,i) {return color(i)},
				"stroke":"black",
				"stroke-width":1
				})

    $(document)
        .on("malware_updated", function () {
            updateMalwarePack();
        });
    var throttleTrigger =
        _.throttle(function () {
            $(document)
                .trigger("malware_updated");
            console.log("how many?");
        }, 100, {
            leading: false
        });

    base.child('malware')
        .on('child_added', function (snap) {
            root.children.push(snap.val());
            throttleTrigger();
            console.log("how many total?");
        });


});
