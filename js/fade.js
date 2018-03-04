function fade(type) {
    svg.selectAll("circle")
        .filter(function(d) {
            return colors_areas[d.Region] != colors_areas[type];
        })
        .transition()
        .style("opacity", hidden_circle_opacity);
}

function fade_by_country(country_name) {

    d3.selectAll("circle")
        .filter(function(d) {
            return !checked_country.includes(d.Country);
        })
        .transition()
        .style("opacity", hidden_circle_opacity);
}

function fade_out() {
    svg.selectAll("circle")
        .transition()
        .style("opacity", initial_circle_opacity);
}