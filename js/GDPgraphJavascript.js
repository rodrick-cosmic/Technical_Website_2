


const w = 800;
const h = 400;
const padding = 60;  
const svg = d3.select(".chart")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

const div = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .attr("id", "tooltip")
                  .style("opacity", 0);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(json) {
  const years = json.data.map(item =>
    parseInt(item[0].substring(0, 4))
  );
  const gdp = json.data.map(item =>
    item[1]
  );
  const dataW = gdp.length;  
  const xScale = d3.scaleLinear()
                   .domain([d3.min(years, d => d), d3.max(years, d => d)])
                   .range([padding, w - padding]);
  
  const yScale = d3.scaleLinear()
                   .domain([d3.min(gdp, d => d), d3.max(gdp, d => d)])
                   .range([h - padding, padding]);
  
  svg.selectAll("rect")
     .data(gdp)
     .enter()
     .append("rect")
     .attr("x", (d, i) => i * ((w - padding * 2) / dataW) + padding)
     .attr("y", (d, i) => (h - padding) - (((h - padding * 2) * d) / d3.max(gdp, d => d)))
     .attr("width", (w - padding * 2) / dataW)
     .attr("height", (d, i) => ((h - padding * 2) * d) / d3.max(gdp, d => d))
     .attr("fill", "navy")
     .attr("class", "bar")
     .attr("data-gdp", (d, i) => json.data[i][1])
     .attr("data-date", (d, i) => json.data[i][0])
     .attr("class", "bar")
     .on("mousemove", function(d, i) {
        div.style("opacity", 9);
        div.attr("data-date", json.data[i][0])
        div.html(" Billion $: " + json.data[i][1] + "</br>"
                 + "Date: " + json.data[i][0])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");    
     })
     .on("mouseout", function(d) {
      div.style("opacity", 0);
  })

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => parseInt(d));
  const yAxis = d3.axisLeft(yScale);
  
  svg.append("g")
     .attr("transform", "translate(0," + (h - padding) + ")")
     .call(xAxis)
     .attr("id", "x-axis");
  
  svg.append("g")
     .attr("transform", "translate(" + padding + ", 0)")
     .call(yAxis)
     .attr("id", "y-axis");
  
});

