//JSON url
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let data;
let dataset = [];
let dates = [];
const req = new XMLHttpRequest();
// Get request, url, true (asyncronous)
req.open('GET', url, true);
req.send();
req.onload = () => {
    //JSON string to JS object
    data = JSON.parse(req.responseText);  
    dataset = data.data;


let width = 800;
let height = 400;
let padding = 50;
let svg = d3.select('svg')

let xAxisScale;
let yAxisScale;
let xScale;
let heightScale;

function setCanvas(){
svg.attr("width", width)
   .attr("height", height)
}

function createScales(){
heightScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, (d) => {
                     return d[1]})])
                .range([0, height - (2 * padding)])
xScale = d3.scaleLinear()
           .domain([0, dataset.length - 1])
           .range([padding, width - padding])

dates = dataset.map((date) => {
    return new Date(date[0])
})

xAxisScale = d3.scaleTime()
               .domain([d3.min(dates), d3.max(dates)])
               .range([padding, width - padding])

yAxisScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, (d) => {
                return d[1]})])
                .range([height - padding, padding])
}

function drawBars(){

let tooltip = d3.select("body") 
                .append("div")
                .attr("id", "tooltip")
                .style("visibility", "hidden")
                .style("width", "auto")
                .style("height", "auto")

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("width", (width - (padding * 2)) / dataset.length)
   .attr("data-date", (data) => {
    return data[0]
   })
   .attr("data-gdp", (data) => {
    return data[1]
   })
   .attr("height", (data) => {
    return heightScale(data[1])
   })
   .attr("x", (data, index) => {
    return xScale(index)
   })
   .attr("y", (data) => {
    return (height - padding) - heightScale(data[1])
   })
   .on('mouseover', (data) => {
    tooltip.transition()
        .style('visibility', 'visible')
        .text(data[0] + "  " + data[1])

    document.querySelector('#tooltip').setAttribute('data-date', data[0])

    })
    .on('mouseout', (data) => {
    tooltip.transition()
        .style('visibility', 'hidden')
    })        
}

function drawAxis(){
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform", "translate(0, " + (height - padding) + ")")

       svg.append('g')
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform", "translate(" + padding + ", 0)")
}

setCanvas();
createScales();
drawAxis();
drawBars();
}