
function initialize_color_labels() {
    // var label_g = d3.select("#bubble_chart")
    //     .append("g")
    //     .attr("id", "label_g")
    //     .attr("x", svg_width + label_svg.width)
    //     .attr("y", 0)
    //     .attr("transform", "translate("+(svg_width+margin.left+10)+","+-margin.top+")")

    var label_g = d3.select("#bubble_label_div")
        .append("svg")
        .attr("id", "label_svg")
        .attr("viewBox", "0 0 " + label_svg.width * 1.5 + " " + label_svg.height * 1.5)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("height", label_svg.height)
        .attr("width", label_svg.width)

    var keys = Object.keys(colors_areas);

    // console.log(label_g)
    for (var i = 0; i < keys.length; i++) {

        var g = label_g.append("g")

        if (i > 0 && colors_areas[keys[i]] == colors_areas[keys[i - 1]]) {

        } else {
            g.append("rect")
                .style("fill", colors_areas[keys[i]])
                .attr("name", keys[i])
                .attr("y", label_svg.side * i * 1.5 + label_svg.margin_top)
                .attr("x", 0)
                .attr("width", label_svg.side)
                .attr("height", label_svg.side)
                .on('mouseover', function() {
                    if (checked_country.length <= 0) {
                        if (play_status) {
                            color_label = d3.select(this).attr("name");
                        } else {
                            fade(d3.select(this).attr("name"));
                        }
                    }
                })
                .on('mouseout', function() {
                    if (checked_country.length <= 0) {
                        if (play_status) {
                            color_label = null;
                        } else {
                            fade_out();
                        }
                    }
                })
        }

        g.append("text")
            .text(keys[i])
            .attr("text-anchor", "start")
            .style("font-size", "20px")
            .attr("x", label_svg.side * 0.5 + label_svg.padding)
            .attr("y", label_svg.side * 1.5 * i + label_svg.side * 0.85 + label_svg.margin_top)
    }
}
