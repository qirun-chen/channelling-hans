// Define a fucntion to draw a simple bar chart
function generateVis() {

    // update checked country array each time
    checked_country = get_checked_country();

    // Filter the data to only include the current year
    filtered_dataset = dataset.filter(function(d) {
        return +d.Year == display_year;
    });

    d3.selectAll("#traces").remove();

    /******** PERFORM DATA JOIN ************/
    // data function => the second parameter => joining index 
    // without the index, when the length of data increases, the order of joining will be a mass.
    var bubbles = d3.select(".bubbles")
        .selectAll("circle")
        .data(filtered_dataset, function(d) { return d.Country; });

    var texts = d3.select(".bubbles")
        .selectAll("text")
        .data(filtered_dataset, function(d) { return d.Country; });

    /******** HANDLE UPDATE SELECTION ************/
    // Update the display of existing elelemnts to mathc new data

    // old version with g element.... now it makes no sense
    // selectAll => selection object
    // selection.transition => transition object
    // note: filtered_dataset is joined with bubbles. so only the anonymous function of the bubbles have access to filtered data,
    // the anonymous function of old bubbles has the first initialized data.
    // this is why i have to use filter again.

    bubbles
        .transition()
        .duration(interval)
        .ease(d3.easeQuad)
        .attr("cx", function(d) { return xScale(+d.GDP); })
        .attr("cy", function(d) { return yScale(+d.LifeExp); })
        .attr("r", function(d, i) {
            return rScale(+d.Population);
        })
        .style("opacity", function(d) {
            if (checked_country.length > 0 && !checked_country.includes(d.Country)) {
                return hidden_circle_opacity;
            } else if (color_label != null) {
                return (colors_areas[d.Region] != colors_areas[color_label] ? hidden_circle_opacity : initial_circle_opacity)
            } else {
                return initial_circle_opacity;
            }
        });

    texts.transition()
        .duration(interval)
        .attr("x", function(d) { return xScale(+d.GDP) + rScale(+d.Population); })
        .attr("y", function(d) { return yScale(+d.LifeExp); })
        .attr("visibility", function(d) {
            if (checked_country.length > 0 && checked_country.includes(d.Country)) {
                return "visible";
            } else {
                return "hidden";
            }
        }); //hidden or visible

    /******** HANDLE ENTER SELECTION ************/
    // Create new elements in the dataset
    bubbles.enter()
        .append("circle")
        .attr("id", function(d) { return "circle_" + d.Country; })
        .attr("cx", function(d) { return xScale(+d.GDP); })
        .attr("cy", function(d) { return yScale(+d.LifeExp); })
        .style("fill", function(d) {
            return colors_areas[d.Region];
        })
        .style("pointer-events", "all")
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .style("opacity", function(d) {

            if (checked_country.length > 0 && !checked_country.includes(d.Country)) {
                return hidden_circle_opacity;
            } else {
                return initial_circle_opacity;
            }

        })
        .on('mouseover', function(d, i) {

            // when the status is paused, the focus line can be draw.
            if (!play_status) {

                // fade(d.Region);
                focus_line.style("display", null);

                // old version with g element.. now it make no sense...~~~
                // get circle's parent g's transform position
                // transform_matrix = this.parentNode.transform.baseVal.consolidate().matrix;

                draw_focus_line(d);
            }

        })
        .on('mouseout', function(d, i) {

            // fade_out()

            focus_line.style("display", "none");
            focus_tip.style("opacity", 0.0);
        })
        .on('click', function(d, i) {

            // if(!checked_country.includes(d.Country)){
            //     checked_country.push(d.Country)
            // }

            // fade_by_country(d.Country)

            // for (var i = checked_country.length - 1; i >= 0; i--) {
            //     d3.select("#text_"+checked_country[i])
            //         .transition()
            //         .attr("visibility", "visible")                               
            // }

        })
        .transition()
        .duration(interval)
        .ease(d3.easeQuad)
        .attr("r", function(d) {
            return rScale(+d.Population);
        });


    texts.enter()
        .append("text")
        .attr("id", function(d) { return "text_" + d.Country })
        .text(function(d) { return d.Country; })
        .attr("text-anchor", "start")
        .attr("visibility", function(d) {

            if (checked_country.length > 0 && checked_country.includes(d.Country)) {
                return "visible";
            } else {
                return "hidden";
            }
        }) //hidden or visible
        .attr("font-size", "20px")
        // .style("opacity", initial_text_opacity)
        .attr("x", function(d) { return xScale(+d.GDP) + rScale(+d.Population); })
        .attr("y", function(d) { return yScale(+d.LifeExp); });


    /******** HANDLE EXIT SELECTION ************/
    // Remove bars that not longer have a matching data eleement
    bubbles.exit()
        // .transition()
        // .duration(300)
        // .ease(d3.easeLinear)
        // .style("fill", "red")
        // .attr("r", +0)
        .remove();

    texts.exit().remove();

    // start traces
    if (document.getElementById("trace_checkBox").checked || document.getElementById("line_checkBox").checked) {
        create_traces()
    }


    // Set the year label
    // d3.select("#year_header").text(display_year)
    d3.select("#year_middle").text(display_year);
}
