/*global jQuery */
var BabyMonitor = (function (device, d3) {
    "use strict";

    var server = '192.168.0.11';

    function home(cb) {
        cb(null, '<section id="home" class="fullscreen"><div class="fullscreen image"></div></section>', function () {
            d3.select('#home .image').style('background-image', 'url()');
        });
    }

    function webcam(cb) {
        var html = [
            '<section id="webcam" class="fullscreen">',
            '<nav>',
            '<a href="#" class="btn"><span class="glyphicon glyphicon-camera"></span></a>',
            '</nav>',
            '<div class="fullscreen image video"></div>',
            '</section>'
        ];

        cb(null, html.join(''), function () {
            var connection = 'low';

            try {
                if (device.connection.type === Connection.WIFI) {
                    connection = 'high';
                }
            } catch (e) {};
            
            d3.select('#webcam .video').style('background-image', 'url(http://' + server + '/video)');
        });
    }

    function temp(cb) {
        cb(null, '<section id="temp" class="fullscreen"><div class="narrow"></div><div class="wide"></div></section>', function () {

            var colors = d3.scale.linear()
                    .domain([16,17.5,18.5,19,19.5])
                    .range(['blue','green','green','yellow','red']),
                narrow = d3.select('#temp div.narrow')
                    .append('svg')
                    .append('g')
                    .attr('class', 'wrapper'),
                margin = {top: 10, right: 10, bottom: 30, left: 50},
                width = d3.max([window.innerWidth, window.innerHeight]) - margin.left - margin.right,
                height = d3.min([window.innerWidth, window.innerHeight]) - margin.top - margin.bottom - 50,
                wide = d3.select('#temp div.wide')
                    .append('svg')
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)

            d3.json('http://' + server + '/temp', function (error, json) {
                if (error) {
                    return console.error(error);
                }
                
                json.forEach(function (d) {
                    d.date = new Date(Date.parse(d.date));
                });

                json = json.sort(function (a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; });

                var latest = json[json.length - 1];

                // NARROW VIEW

                narrow
                    .append('circle')
                    .attr('r', 150)
                    .attr('fill', colors(latest.temp));
                narrow
                    .append('g')
                    .attr('class', 'number')
                    .append('text')
                    .html(latest.temp.toFixed(1) + '&deg;');   

                // WIDE VIEW
                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                x.domain(d3.extent(json, function(d) { return d.date; }));
                y.domain([
                    d3.min([10, d3.min(json, function(d) { return d.temp; })]),
                    d3.max([30, d3.max(json, function(d) { return d.temp; })]),
                ]);

                var line = d3.svg.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.temp); });

                wide.append("linearGradient")                
                    .attr("id", "line-gradient")            
                    .attr("gradientUnits", "userSpaceOnUse")    
                    .attr("x1", 0).attr("y1", y(y.domain()[1]))         
                    .attr("x2", 0).attr("y2", y(y.domain()[0]))      
                    .selectAll("stop")                      
                    .data(([y.domain()[1]].concat(colors.domain().reverse().concat([y.domain()[0]]))).map(function (c) {
                        console.log(c, ((y(c) / height) * 100).toFixed(0) + "%", colors(c), colors(18), colors(17.9));
                        return { offset: ((y(c) / height) * 100).toFixed(0) + "%", color: colors(c) };
                    }))                  
                    .enter().append("stop")         
                    .attr("offset", function(d) { return d.offset; })   
                    .attr("stop-color", function(d) { return d.color; });   

                wide = wide.append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                wide.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                wide.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .html("Temperature (&deg;C)");

                wide.append("path")
                    .datum(json)
                    .attr("class", "line")
                    .attr("d", line);
            });            
        });
    }

    function settings(cb) {
        cb(null, '', function () {});
    }

    var page_container = '#main_page',
        error_container = '#error_page',
        pages = {
            home: home,
            webcam: webcam,
            temp: temp,
            settings: settings
        };

    function loading() {
        d3.select(page_container).html('<p>Loading...</p>');
    }

    function load_error(error) {
        d3.select(error_container + ' div').text(error);
        d3.select(error_container).style('display', 'block');
    }

    function load_page(page) {
        loading();

        d3.selectAll('#nav li').classed('active', false);
        d3.select('#nav li#nav-' + page).classed('active', true);

        pages[page](function (error, html, load) {
            if (error) {
                return load_error(error);
            }

            d3.select(page_container).html(html);
            load();
        });
    }

    function nav_click(on) {
        var p = d3.select(on).attr('href').slice(1);
        load_page(p);
    }

    function init() {
        load_page('home');

        var touched = false;

        d3.selectAll('#nav li a').on('touchstart', function () {
            touched = true;
            nav_click(this);
        });
        d3.selectAll('#nav li a').on('click', function () {
            if (!touched) {
                nav_click(this);
            }
        });
    }


    d3.select(document).on('deviceready', init);
    init();

    return {
        init: init
    };

}(navigator, d3));
