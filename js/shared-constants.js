// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 }; 
const width = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

//set up inner chart variable for line chart
let innerChart;

//set up tooltip dimensions
const tooltipWidth = 65;
const tooltipHeight = 32;

// Set up colors accessible globally
const barColor = "#81663E"
const bodyBackgroundColor = "#fffaf0";

// Set up the scatterplot scales and color scale
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal()

// Create a bin generator using d3.bin
const binGenerator = d3.bin()
.value(d => d.hospitalisation) //Accessor for hospitalisation



