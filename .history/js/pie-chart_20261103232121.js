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
.sort((a, b) => d3.descending(a.hospitalisations, b.hospitalisations))
.startAngle(0)
;

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
.data(pie(data.filter(function(d){ return d.year == 2021})))
.join("path")
.attr("d", arcGenerator)
.attr("fill", d => color(d.data.road_user))
.attr("stroke", "white")
.attr("stroke-width", 0)

innerChart
 .selectAll("text")
.data(pie(data.filter(function(d){ return d.year == 2021})))
 .join("text")
 .text(d=>d.data.road_user)
.attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 10)



        
function update(selectedGroup) {

      // Create new data with the selection?
      const dataFilter = data.filter(function(d){return d.name==selectedGroup})

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.arc()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(+d.n) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }
//https://d3-graph-gallery.com/graph/pie_changeData.html
//https://d3-graph-gallery.com/graph/basic_datamanipulation.html (data filter)


  d3.select("#yearchange").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })
} 