function initialize_checkbox() {

    var scroll_box = d3.select("#country_checkbox_scroll")
    scroll_box.style("overflow-y", "scroll")
        .style("width", "200px")
        .style("height", "250px")

    // get country names and sort in alphabetical order
    var country_name_array = Object.keys(country_region).sort(function(x, y) {
        return d3.ascending(x, y);
    });

    for (var i = 0; i < country_name_array.length; i++) {
        scroll_box.append("label")
            .html("<input class='country_checkbox' value='" + country_name_array[i] + "' type='checkbox'>" + country_name_array[i] + "<br>")
    }
}

