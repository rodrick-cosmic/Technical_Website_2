const data = [
  
    { name: 'The Matrix II (73%)', score: 73 },
    { name: 'The Matrix (88%)', score: 88 },
    { name: 'The Matrix III (34%)', score: 34 },
    { name: 'The Matrix IV (64%)', score: 64 },
    { name: 'The Animatrix (89%)', score: 89 },
   
  ];
  
  const width = 1000;
  const height = 750;
  const margin = { top: 50, bottom: 50, left: 50, right: 10 };
  
  const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width - margin.left - margin.right)
    .attr('height', height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width, height]);
  
  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1)
  
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top])
  
  svg
    .append("g")
    .attr("fill", 'green')
    .selectAll("rect")
    .data(data.sort((a, b) => d3.descending(a.score, b.score)))
    .join("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.score))
      .attr('title', (d) => d.score)
      .attr("class", "rect")
      .attr("height", d => y(0) - y(d.score))
      .attr("width", x.bandwidth());
  
  function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).ticks(null, data.format))
      .attr("font-size", '20px')
  }
  
  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name))
      .attr("font-size", '20px')
  }
  
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  svg.node();
  