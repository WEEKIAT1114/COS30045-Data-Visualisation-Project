d3.csv("../data/annual-totals.csv", d => {

  return {

    year: d.year,

    hospitalisations: +d.hospitalisations

  };

}).then(data => {

    console.log(data);

    console.log(data.length);

    console.log(d3.max(data, d => d.hospitalisations));

    console.log(d3.min(data, d => d.hospitalisations));

    data.sort((a, b) => a.year - b.year);

    drawLineChart(data);

});

const drawLineChart = data => {
  const margin = { top:70, right: 170, bottom: 55, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;



const svg = d3.select("#line-chart")

    .append("svg")

    .attr("viewBox", `0, 0, ${width}, ${height}`)

    .style("border", "1px solid black");

const innerChart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)


  const xScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.year))
  .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.hospitalisations)])
  .range([innerHeight, 0]);

const bottomAxis = d3.axisBottom(xScale)
.tickFormat(d3.format("d"));
const leftAxis = d3.axisLeft(yScale);

innerChart
svg.selectAll("myCircles")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "myCircles")
        .attr("stroke", "none")
        .attr("cx", d => xScale (d.year)+40)
        .attr("cy", d => yScale (d.hospitalisations)+70)
        .attr("r", 3)
        .attr("fill", "blue");

const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.hospitalisations));


//title
innerChart
        svg.append('text')
        .attr('x', width/2 + 10)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Annual Road Crash Hospitalisation in Australia (2011-2021)');

innerChart
    .append("path")
    .attr("d", lineGenerator(data))
    .attr("fill", "none")
    .attr("stroke", "blue");



innerChart
.append("g")
.attr("transform", `translate(0,${innerHeight})`)
.call(bottomAxis)

innerChart
.append("g")
.call(leftAxis);


innerChart
.append("text")
.text("Number of Hospitalisations")
.attr("x", -margin.left)
.attr("y", -15)
.attr("text-anchor", "start");

innerChart
.append("text")
.text("Year")
.attr("x", 810)
.attr("y", 380)
.attr("text-anchor", "start");

 const Tooltip = d3.select("#line-chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip
          .style("opacity", 1)
      }
      const mousemove = function(event,d) {
        Tooltip
          .html("Exact value: " + d.value)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
      }
      const mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 0)
      }



    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
        .attr("class", "myCircle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 8)
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



};
