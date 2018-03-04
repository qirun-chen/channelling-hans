
// Define margins
var margin = { top: 10, right: 500, bottom: 60, left: 60 };

var label_svg = { width: 130, height: 210, padding: 20, side: 20, margin_top: 30 };

var geo_map = { width: 460, height: 240 };

//Width and height
var outer_width = 1400;
var outer_height = 600;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;

// The year to display
min_year = null;
max_year = null;
display_year = null;

// dataset
dataset = null;

// checked_country
checked_country = [];

// play status => true : play  /  false : pause
play_status = false;

// if the color label is choosen, filter out the circles with other color labels; if not, it is null
// assigned with region name and used with country_region dict
color_label = null;

var initial_interval = 300;
var interval = initial_interval;

// set intial circle attribute 
initial_circle_opacity = 1;
hidden_circle_opacity = .2;
initial_text_opacity = 0;

// assign colors to different areas
colors_areas = {
    "Asia": "rgb(255,38,0)",
    "Oceania": "rgb(255,38,0)",
    "Australia": "rgb(255,38,0)",
    "North America": "rgb(0,142,0)",
    "Central America": "rgb(0,142,0)",
    "South America": "rgb(0,142,0)",
    "Europe": "rgb(255,179,2)",
    "Africa": "rgb(4,51,255)"
};

//Create SVG element as a group with the margins transform applied to it
var svg = d3.select("#bubble_chart_div")
    .append("svg")
    .attr("id", "bubble_chart")
    // .attr("width", svg_width + margin.left*1.3)
    // .attr("height", svg_height + margin.top + margin.bottom)
    // .attr("transform", "scale(0.7)")
    .attr("viewBox", "0 0 " + (svg_width + margin.left * 1.3) + " " + (svg_height + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("class", "chart")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

initialize_titles();

// Gapminder_Small
// ./data/Gapminder_All_Time.csv
// Load the file data.csv and generate a visualisation based on it
d3.csv("./data/Gapminder_All_Time.csv", function(error, data) {

    // handle any data loading errors
    if (error) {
        console.log("Something went wrong");
        console.log(error);
    } else {
        console.log("Data Loaded");

        // Assign  the data object loaded to the global dataset variable
        dataset = data;

        year_list = d3.map(dataset, function(d) { return +d.Year; }).keys();
        // sort year_list in ascending order
        year_list = year_list.sort(function(x, y) {
            return +d3.ascending(+x, +y);
        })
        min_year = d3.min(dataset.map(function(d) { return +d.Year; }));
        max_year = d3.max(dataset.map(function(d) { return +d.Year; }));

        initialize_slider();

        display_year = min_year;

        // radius scale
        rScale = d3.scaleSqrt().domain([0, 5e8]).range([3, 30]);

        initialize_axis();

        d3.select(".chart").append("g").attr("class", "bubbles");

        initialize_color_labels();

        initialize_focus_point();

        // Generate the visualisation
        generateVis();

        initialize_geo_map();

        initialize_checkbox();

        initialize_region_barchart();

        initialize_govern_barchart();

        draw_region_barchart();

        draw_govern_barchart();
    }
});

var filtered_dataset = null;
