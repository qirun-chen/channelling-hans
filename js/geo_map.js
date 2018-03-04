function get_checked_country() {

    // convert nodelist to array, because map needs an iteratable object
    var checked_country = Array.from(d3.selectAll(".country_checkbox:checked")._groups[0]);
    // console.log(checked_country)
    return checked_country.map(function(d) { return d.value; })
}

function initialize_geo_map() {

    var geo_map_svg = d3.select("#geo_map").append("svg");

    geo_map_svg.attr("width", geo_map.width)
        .attr("height", geo_map.height)
        .attr("viewBox", "0 0 " + geo_map.width + " " + geo_map.height)
        .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("transform", "translate(0," + outer_height + ")");

    // define the cylinder of the map
    var projection = d3.geoCylindricalEqualArea()
        .scale(90)
        .translate([230, 120]) // translate the center position of the map in the svg
        .precision(0.1);

    // define geo-path creator
    var path = d3.geoPath()
        .projection(projection);

    // draw net lines 
    // var graticule = d3.geoGraticule();

    // svg.append("path")
    //     .datum(graticule)
    //     .attr("class", "graticule")
    //     .attr("d", path);

    // svg.append("path")
    //     .datum({type: "Sphere"})
    //     .attr("class", "sphere")
    //     .attr("d", path)
    //     .attr("fill", "none")
    //     .attr("stroke", "black");

    country_dict = {};

    function last_year_filter(value) {
        return value.Year == max_year;
    }

    country_region = get_country_region(dataset.filter(last_year_filter));
    // console.log(country_region)


    d3.tsv("./data/world-country-names.tsv", function(error, data) {
        if (error) throw error;

        country_dict = {};
        var standard_names = Object.keys(country_region);

        // when loading country names with ids, handle with inconsistent country names.
        for (var i = 0; i < data.length; i++) {
            country_dict[data[i].id] = data[i].name;
            for (var j = standard_names.length - 1; j >= 0; j--) {
                if (data[i].name.indexOf(standard_names[j]) >= 0) {
                    // console.log(data[i].name, standard_names[j])
                    country_dict[data[i].id] = standard_names[j];
                    break;
                }
            }
        }
        // console.log("after",country_dict)
    });


    // add text on each country
    map_tip = d3.select('#bubble_div').append("div")
        .attr("class", "tip")
        .style("opacity", 0.0)

    // assign data to world
    d3.json("./data/world-110m.json", function(error, world) {
        if (error) throw error;

        var georoot = topojson.feature(world, world.objects.countries);

        // initialize country id list
        var countries = world.objects.countries.geometries;

        var groups = geo_map_svg.append("g");

        var path_binding = groups.selectAll("path")
            .data(georoot.features);

        // handle_inconsistent_names(country_region, country_dict);

        var enter = path_binding.enter()
            .insert("path")
            // .datum(georoot.features)
            .attr("class", "land")
            .attr("d", path)
            // d.id => country id in json data , i => the index in countries array
            .style("fill", function(d, i) {
                country_name = country_dict[+d.id];

                // console.log(country_region[country_dict[+d.id]]);
                return colors_areas[country_region[country_dict[+d.id]]];
            })
            // d.id => country id in json data , i => the index in countries array
            .on('mouseover', function(d, i) {
                // when some countries are checked, fade will damage the opacity.
                // so only no coountry is checked, colors can be faded.
                if (country_dict.hasOwnProperty(+d.id)) {
                    // console.log(country_dict[+d.id])

                    map_tip.html(country_dict[+d.id])
                        .style("left", d3.event.pageX + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1.0)

                    var curr_region = country_region[country_dict[+d.id]]
                    if (Object.keys(colors_areas).indexOf(curr_region) > -1 && checked_country.length <= 0) {
                        if (play_status) {
                            color_label = curr_region;
                        } else {
                            fade(curr_region);
                        }
                    }
                }
                // d3.select(this).style("fill", "red")
            })
            .on('mousemove', function(d) {

                map_tip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
            })
            .on('mouseout', function(d) {

                map_tip.style("opacity", 0.0)

                if (checked_country.length <= 0) {
                    if (play_status) {
                        color_label = null;
                    } else {
                        fade_out();
                    }
                }
            })

        // groups.append("path")
        //     .datum(georoot)
        //     .attr("class", "land")
        //     .attr("d", path);

        // draw the boundaries of countries
        // svg.append("path")
        //     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        //     .attr("class", "boundary")
        //     .attr("d", path);
    });
}

region_xScale = null;
region_yScale = null;
barchart_height = 230;

var country_region_dict = {}

function get_country_region(filtered_datset) {


    for (var i = filtered_datset.length - 1; i >= 0; i--) {
        country_region_dict[filtered_datset[i].Country] = filtered_datset[i].Region;
    }
    return country_region_dict;
}   