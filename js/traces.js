function create_traces() {

    // ############################################
    // circle's traces enter......
    trace_dataset = dataset.filter(function(d) {
        if (checked_country.length > 0) {
            return checked_country.includes(d.Country) && display_year >= +d.Year;
        }
        return false;
    })

    var traces = d3.select(".bubbles")

    path_dict = {}
    for (var i = checked_country.length - 1; i >= 0; i--) {
        path_dict[checked_country[i]] = ""
    }

    for (var i = 0; i < trace_dataset.length - 1; i++) {
        var circle_data = trace_dataset[i]

        if (document.getElementById("trace_checkBox").checked) {

            traces.append("circle")
                .attr("id", "traces")
                .attr("cx", xScale(+trace_dataset[i].GDP))
                .attr("cy", yScale(+trace_dataset[i].LifeExp))
                .attr("r", rScale(+trace_dataset[i].Population))
                .style("fill", colors_areas[trace_dataset[i].Region])
                .style("pointer-events", "all")
                .style("stroke", "black")
                .style("stroke-width", 0.1)
                .style("opacity", initial_circle_opacity)
        }

        if (document.getElementById("line_checkBox").checked) {
            if (path_dict[trace_dataset[i].Country] == "") {
                path_dict[trace_dataset[i].Country] += "M " + xScale(+trace_dataset[i].GDP) + " " + yScale(+trace_dataset[i].LifeExp)
            } else {
                path_dict[trace_dataset[i].Country] += " L " + xScale(+trace_dataset[i].GDP) + " " + yScale(+trace_dataset[i].LifeExp)
            }
        }
    }

    if (document.getElementById("line_checkBox").checked) {
        for (var i = checked_country.length - 1; i >= 0; i--) {
            traces.append("path")
                .attr("d", path_dict[checked_country[i]])
                .attr("id", "traces")
                .attr("stroke", colors_areas[country_region_dict[checked_country[i]]])
                .attr("stroke-width", "2")
                .attr("fill", "none")
        }
    }

}
