function initialize_axis() {
    // Set up the scale to be used on the x axis
    xScale = d3.scaleLinear();

    // Set up the scale to be used on the y axis
    yScale = d3.scaleLinear();

    topScale = d3.scaleLinear().range([0, svg_width]);
    rightScale = d3.scaleLinear().range([svg_height, 0]);
    var topAxis = d3.axisTop().scale(topScale).ticks(0);
    var rightAxis = d3.axisRight().scale(rightScale).ticks(0);

    // Create an x-axis connected to the x scale
    var xAxis = d3.axisBottom()
        .scale(xScale);

    //Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale);

    y_min = d3.min(dataset.map(function(d) { return +d.LifeExp; }));
    y_max = d3.max(dataset.map(function(d) { return +d.LifeExp; }));
    x_min = d3.min(dataset.map(function(d) { return +d.GDP; }));
    x_max = d3.max(dataset.map(function(d) { return +d.GDP; }));

    // Call axes
    svg.append("g")
        .attr("class", "axis")
        .attr("id", "y-axis");

    svg.append("g")
        .attr("class", "axis")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (svg_height) + ")");

    svg.append("g")
        .attr("class", "axis")
        .call(topAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (svg_width) + ",0)")
        .call(rightAxis);

    x_ticks = [500, 1000, 2000, 5000, 10000, 20000, 50000];
    x_domain = [0].concat(x_ticks).concat([x_max]);

    y_ticks = [50, 55, 60, 65, 70, 75, 80];
    y_domain = [0].concat(y_ticks).concat([y_max]);

    xScale.domain(x_domain)
        .range([0, 50, 150, 250, 400, 500, 600, 750, svg_width]);

    yScale.domain(y_domain)
        .range([svg_height, 455, 390, 325, 260, 195, 130, 65, 0]);

    //Define Y axis
    var yAxis = d3.axisLeft()
        .scale(yScale)
        // .ticks(5);
        .tickValues(y_ticks);

    // Update the domain of the x scale
    // Create an x-axis connected to the x scale
    var xAxis = d3.axisBottom()
        .scale(xScale)
        // .ticks(5);
        .tickValues(x_ticks);

    svg.select("#x-axis").call(xAxis);
    svg.select("#y-axis").call(yAxis);

    // use css to draw grid dash lines
    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + svg_height + ")")
        .call(
            d3.axisBottom(xScale).tickValues(x_ticks)
            .tickSize(-svg_height)
            .tickFormat("")
        );
    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(
            d3.axisLeft(yScale).tickValues(y_ticks)
            .tickSize(-svg_width)
            .tickFormat("")
        );

}

function initialize_titles() {

    var title_1 = svg.append("text")
        .attr("x", 30)
        .attr("y", 30)
        .attr("font-family", "serif")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .text("Gapminder World")


    var title_2 = svg.append("text")
        .attr("x", 30)
        .attr("y", 50)
        .attr("font-family", "serif")
        .attr("font-size", "15px")
        .text("Mapping the Wealth and Health of Nations")

    var title_year = svg.append("text")
        .attr("x", 280)
        .attr("y", 30)
        .attr("font-family", "serif")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .attr("id", "year_header");

    var title_x_axis = svg.append("text")
        .attr("x", 130)
        .attr("y", 580)
        .attr("font-family", "serif")
        .attr("font-size", "20px")
        .style("font-weight", "bold")
        .text("INCOME PER PERSON")

    var title_x_axis_unit_1 = svg.append("text")
        .attr("x", 350)
        .attr("y", 580)
        .attr("font-family", "serif")
        .attr("font-size", "15px")
        .text("in US Dollars")

    var title_x_axis_unit_1 = svg.append("text")
        .attr("x", 440)
        .attr("y", 580)
        .attr("font-family", "serif")
        .attr("font-size", "15px")
        .attr("font-style", "italic")
        .text("(GDP/capita, PPP$ in ation adjusted, log scale)")

    var title_y_axis = svg.append("text")
        .attr("x", -40)
        .attr("y", 450)
        .style("font-family", "serif")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .attr("transform", "rotate(-90 -40,450)")
        .text("LIFE EXPECTANCY")

    var title_y_axis_unit = svg.append("text")
        .attr("x", -40)
        .attr("y", 255)
        .style("font-family", "serif")
        .style("font-size", "20px")
        .attr("transform", "rotate(-90 -40,255)")
        .text("in years")

    var title_year = svg.append("text")
        .attr("x", 30)
        .attr("y", 140)
        .attr("font-family", "'Varela Round', sans-serif") //'Roboto Mono', monospace //'Varela Round', sans-serif;
        .attr("font-size", "100px")
        .attr("font-weight", "bold")
        .attr("id", "year_middle")
        .style("fill", "#E0E0E0") //#C0C0C0
        .attr("transform", "scale(2.5)");

}

function initialize_slider() {

    slider_div = d3.select("#slider_div")
    slider_div.append("span")
        .attr("id", "min_year")
        .style("height", "30px")
        .style("width", "10%")
        .html(min_year)
    slider_div.append("input")
        .attr("type", "range")
        .attr("min", min_year)
        .attr("max", max_year)
        .attr("value", min_year)
        .attr("step", 1)
        .attr("id", "year_slider")
        .style("width", "70%")
        .style("height", "16px")
        .on("input", function() {

            current_value = d3.select(this).property("value")
            if (!year_list.includes("" + current_value)) {
                var years_more_than_this = year_list.filter(function(year) {
                    return current_value < +year;
                })
                display_year = years_more_than_this[0];
            } else {
                // current_value must be in the range of slider, so no need to worry about being greater than max_year
                display_year = current_value;
            }

            generateVis();
            draw_region_barchart();
            draw_govern_barchart();
        });
    slider_div.append("span")
        .attr("id", "max_year")
        .style("height", "30px")
        .style("width", "10%")
        .html(max_year)
}