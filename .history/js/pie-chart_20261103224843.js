d3.csv("../data/all-years-road-user.csv", d => {

  return {

    road_user: d.road_user,

    year: d.year,

    hospitalisations: +d.hospitalisations


  };

}).then(data => {

    console.log(data);

    console.log(data.length);

    drawPieChart(data);

});

const drawPieChart = data => {
  const width = 1000;
  const height = 500;
  const radius = Math.min(width, height) / 2 - 20;

const color = d3.scaleOrdinal()
.domain(data.map(d => d.road_user))
.range(d3.schemeSet2);

const pie = d3.pie()
.value(d => d.hospitalisations)
.sort(null);

const arcGenerator = d3.arc()
.innerRadius(0)
.outerRadius(150)
.padAngle(0.00)
.cornerRadius(0);

const allGroup = new Set(data.map(d => d.year))

const svg = d3.select("#pie-chart")
.append("svg")
.attr("viewBox", `0,0, ${width}, ${height}`)
.style("border", "1px solid black");

const innerChart = svg
.append("g")
.attr("transform", `translate(${width/2}, ${height/2})`)
//title
innerChart
        svg.append('text')
        .attr('x', width/2 + 10)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Road Crash Hospitalisations by Road User in Australia');

innerChart
.selectAll("path")
.data(pie(data.filter(function(d){ return d.year == 2021}), data.sort(function(a,b) { return +a.hospitalisations - +b.hospitalisations })))
.join("path")
.attr("d", arcGenerator)
.attr("fill", d => color(d.data.road_user))
.attr("stroke", "white")
.attr("stroke-width", 0)

innerChart
 .selectAll("text")
.data(pie(data.filter(function(d){ return d.year == 2021}), data.sort(function(a,b) { return +a.hospitalisations - +b.hospitalisations })))
 .join("text")
 .text(d=>data.sort(function(a,b) { return +a.road_user - +b.road_user }))
.attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 10)



        
function update(data) {

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  const data_ready = pie(Object.entries(data))

  // map to data
  const u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .join('path')
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)


}

  d3.select("#yearchange").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
} 