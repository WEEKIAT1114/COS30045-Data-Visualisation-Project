const createTooltip = (data) => {
    const tooltip = innerChart
    .append("g")
    .attr("class", "tooltip")
    .style("opacity", 0);

    tooltip
    .append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", barColor)
    .attr("fill-opacity", 0.75);

    tooltip
    .append("text")
    .text("NA")
    .attr("x", tooltipWidth/2)
    .attr("y", tooltipHeight/2 + 2)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", 900);


}

    const handleMouseEvents = () =>  {
        d3.selectAll("#line-chart circle") //line 87 assisted by AI
        .on("mouseenter", (e,d) => {
            console.log("Mouse entered circle", d);

            d3.select(".tooltip text")
            .text(d.screenSize);

            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");
            
            d3.select(".tooltip")
            .attr("transform", `translate(${cx - 0.5*tooltipWidth}, ${cy - 1.5 * tooltipHeight})`)
            .transition()
            .duration(200)
            .style("opacity", 1);
        })

        .on("mouseleave", (e,d) => {
            console.log("Mouse left circle", d);

            d3.select(".tooltip")
            .style("opacity", 0)
            .attr("transform", `translate(0, 500)`);
        });
    }