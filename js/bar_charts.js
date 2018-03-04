function initialize_region_barchart() {

var svg_width = 300
var margin = { left: 30, top: 10, right: 10, bottom: 70 }

var country_region_svg = d3.select("#country_region_barchart")
    .append("svg")
    .attr("width", svg_width + margin.left + margin.right)
    .attr("height", barchart_height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "region_svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var region_dict = {}
var regions = Object.keys(colors_areas);
for (var i = regions.length - 1; i >= 0; i--) {
    region_dict["" + regions[i]] = +filtered_dataset.filter(function(d) {
        return d.Region == regions[i]
    }).length
}

region_xScale = d3.scaleBand()
    .range([0, svg_width])
    .domain(regions)
    .paddingInner(0.3)
    .paddingOuter(0.5);

region_yScale = d3.scaleLinear()
    .range([barchart_height, 0])
    .domain([0, Math.max(...Object.values(region_dict))])

var xAxis = d3.axisBottom()
    .scale(region_xScale);

var yAxis = d3.axisLeft()
    .ticks(5)
    .scale(region_yScale);

country_region_svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + barchart_height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

country_region_svg.append("g")
    .attr("class", "axis")
    .call(yAxis);
}

function draw_region_barchart() {

var region_data = []
var regions = Object.keys(colors_areas);
for (var i = regions.length - 1; i >= 0; i--) {
    dict = {}
    dict["Region"] = regions[i];
    dict["Number"] = +filtered_dataset.filter(function(d) {
        return d.Region == regions[i]
    }).length;
    region_data.push(dict)
}

console.log(region_data)

var bars = d3.select("#region_svg").selectAll("rect")
    .data(region_data, function(d) { return d.Region; });

bars.transition()
    .duration(interval)
    .ease(d3.easeBounce)
    .attr("y", function(d) {
        return region_yScale(d.Number);
    })
    .attr("x", function(d) {
        return region_xScale(d.Region);
    })
    .attr("height", function(d) {
        return barchart_height - region_yScale(d.Number);
    })
    .attr("width", function(d) {
        return region_xScale.bandwidth();
    });


bars.enter()
    .append("rect")
    .transition()
    .duration(interval)
    .ease(d3.easeBounce)
    .attr("y", function(d) {
        return region_yScale(d.Number);
    })
    .attr("x", function(d) {
        return region_xScale(d.Region);
    })
    .attr("height", function(d) {
        console.log(barchart_height, region_yScale(d.Number))
        return barchart_height - region_yScale(d.Number);
    })
    .attr("width", function(d) {
        return region_xScale.bandwidth();
    })
    .style("fill", function(d) {
        return colors_areas[d.Region];
    });

bars.exit().remove();
}

govern_xScale = null;
govern_yScale = null;

function initialize_govern_barchart() {

var svg_width = 300
var margin = { left: 30, top: 10, right: 10, bottom: 120 }

var country_govern_svg = d3.select("#country_govern_barchart")
    .append("svg")
    .attr("width", svg_width + margin.left + margin.right)
    .attr("height", barchart_height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "govern_svg")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var government_dict = {}
var governments = Array.from(new Set(filtered_dataset.map(function(d) { return d.Government; })));
for (var i = governments.length - 1; i >= 0; i--) {
    government_dict["" + governments[i]] = +filtered_dataset.filter(function(d) {
        return d.Government == governments[i]
    }).length
}

govern_xScale = d3.scaleBand()
    .range([0, svg_width])
    .domain(governments)
    .paddingInner(0.3)
    .paddingOuter(0.5);

govern_yScale = d3.scaleLinear()
    .range([barchart_height, 192, 152, 114, 76, 0])
    .domain([0, 5, 10, 30, 40, Math.max(...Object.values(government_dict))])

var xAxis = d3.axisBottom()
    .scale(govern_xScale);

var yAxis = d3.axisLeft()
    .tickValues([0, 5, 10, 30, 40, Math.max(...Object.values(government_dict))])
    .scale(govern_yScale);

country_govern_svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + barchart_height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

country_govern_svg.append("g")
    .attr("class", "axis")
    .call(yAxis);
}

function draw_govern_barchart() {

var government_data = []
var governments = Array.from(new Set(filtered_dataset.map(function(d) { return d.Government; })));
for (var i = governments.length - 1; i >= 0; i--) {
    dict = {}
    dict["Government"] = governments[i];
    dict["Number"] = +filtered_dataset.filter(function(d) {
        return d.Government == governments[i]
    }).length;
    government_data.push(dict)
}

console.log(government_data)

var bars = d3.select("#govern_svg").selectAll("rect")
    .data(government_data, function(d) { return d.Government; });

bars.transition()
    .duration(interval)
    .ease(d3.easeBounce)
    .attr("y", function(d) {
        return govern_yScale(d.Number);
    })
    .attr("x", function(d) {
        return govern_xScale(d.Government);
    })
    .attr("height", function(d) {
        return barchart_height - govern_yScale(d.Number);
    })
    .attr("width", function(d) {
        return govern_xScale.bandwidth();
    })
    .style("fill", "rgb(170,121,65)");


bars.enter()
    .append("rect")
    .transition()
    .duration(interval)
    .ease(d3.easeBounce)
    .attr("y", function(d) {
        return govern_yScale(d.Number);
    })
    .attr("x", function(d) {
        return govern_xScale(d.Government);
    })
    .attr("height", function(d) {
        return barchart_height - govern_yScale(d.Number);
    })
    .attr("width", function(d) {
        return govern_xScale.bandwidth();
    })
    .style("fill", "rgb(170,121,65)");

bars.exit().remove();
}