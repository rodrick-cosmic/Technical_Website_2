import * as d3 from 'https://unpkg.com/d3?module'
const PATH =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/";

const DS = {
  movies: {
    title: "Movies Sales",
    desc: "Top 100 Highest Grossing Films Grouped By Genre",
    url: PATH + "movie-data.json"
  },
};


const title = d3.select("#title");
const desc = d3.select("#description");


const margin = { top: 5, right: 5, bottom: 5, left: 5 };


const WIDTH = 1300 - margin.right - margin.left;
const HEIGHT = 1000 - margin.top - margin.bottom;
const LEG_WIDTH = 610;


const combined = [...d3.schemePaired, ...d3.schemeTableau10.reverse()];
const colors = d3.scaleOrdinal(combined);


const svg = d3
  .select("#tree-map")
  .append("svg")
  .attr("width", WIDTH + margin.right + margin.left)
  .attr("height", HEIGHT + margin.top + margin.bottom);


const tooltip = d3
  .select("#tree-map")
  .append("div")
  .attr("class", "tooltip text-white shadow-sm rounded")
  .attr("id", "tooltip")
  .style("opacity", 0);


const mouseover = function (e) {
  tooltip.style("opacity", 0.9);
};

const mousemove = function (e) {
  const name = e.target.getAttribute("data-name");
  const category = e.target.getAttribute("data-category");
  const value = e.target.getAttribute("data-value");
  var html = "<h6>" + name + "</h6>";
  html += "<p><b>Category</b>: " + category + "</p>";
  html += "<p><b>Value</b>: " +  "$" + value + " Billion" + "</p>";
  const offset = svg.attr("class") == "games" ? { x: 150, y: 80 } : svg.attr("class") == "movies" ? { x: 150, y: 100 } : { x: 150, y: 125 }
  
  tooltip
    .html(html)
    .attr("data-value", value)
    .style("left", e.pageX - offset.x + "px")
    .style("top", e.pageY - offset.y + "px");
};

const mouseleave = function (e) {
  tooltip.style("opacity", 0);
};


const legend = d3
  .select("body")
  .append("svg")
  .attr("id", "legend")
  .attr("width", LEG_WIDTH);


function query(key, val) {
  if (window.history.pushState) {
    let search = new URLSearchParams(window.location.search);
    search.set(key, val);

    var newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      search.toString();

    window.history.pushState({ path: newUrl }, "", newUrl);
  }
}


function updatePage(q = "games") {
  if (q === "movies") {
    title.text(DS.movies.title);
    desc.text(DS.movies.desc);
    svg.attr("class", "movies");
    legend.attr("height", 60);
    d3.json(DS.movies.url).then((data) => getData(data));
  } else if (q === "ksPledges") {
    title.text(DS.ksPledges.title);
    desc.text(DS.ksPledges.desc);
    svg.attr("class", "kickstarter");
    legend.attr("height", 180);
    d3.json(DS.ksPledges.url).then((data) => getData(data));
  } else if (q === "games") {
    title.text(DS.games.title);
    desc.text(DS.games.desc);
    svg.attr("class", "games");
    legend.attr("height", 90);
    d3.json(DS.games.url).then((data) => getData(data));
  }
}

document.querySelectorAll("a").forEach((a) => {
  a.addEventListener(
    "click",
    function (e) {
      updatePage(e.target.id);
    },
    true
  );
  a.addEventListener(
    "click",
    function (e) {
      query("data", e.target.id);
    },
    true
  );
});


function getData(data) {
 
  const root = d3
    .hierarchy(data)
    .eachBefore(function (d) {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum((d) => d.value)
    .sort((v1, v2) => v1.height - v2.height || v2.value - v1.value);

  d3.treemap().size([WIDTH, HEIGHT]).padding(1)(root);

  
  svg
    .selectAll()
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .style("stroke", "#fff")
    .style("stroke-width", 5)
    .attr("id", (d) => d.data.id)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", mouseover) 
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .style("fill", (d) => colors(d.data.category));

  svg
    .selectAll()
    .data(root.leaves())
    .enter()
    .append("foreignObject") 
    .attr("x", (d) => d.x0 + 3)
    .attr("y", (d) => d.y0 + 3)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .append("xmlns:div")
    .attr("data-name", (d) => d.data.name)  
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .html(
      (n) =>
        "<p style='color: #000; padding-right: 8px'>" + n.data.name + "<p>"
    );


  legend.selectAll("*").remove();


  var cats = root.leaves().map((nodes) => nodes.data.category);
  cats = cats.filter((cat, i, self) => self.indexOf(cat) === i);


  const LEG_OFFSET = 8;
  const LEG_RECT_SIZE = 15;

  const legSpacing =
    svg.attr("class") === "games"
      ? { h: 90, v: 10 }
      : svg.attr("class") === "movies"
      ? { h: 150, v: 10 }
      : { h: 200, v: 10 };

  const legTxtOffset = { x: 4, y: -1 };
  const LEG_EL_PER_ROW = Math.floor(LEG_WIDTH / legSpacing.h);


  const legG = legend
    .selectAll()
    .data(cats)
    .enter()
    .append("g")
    .attr("transform", function (d, i) {
      return (
        "translate(" +
        (i % LEG_EL_PER_ROW) * legSpacing.h +
        "," +
        (Math.floor(i / LEG_EL_PER_ROW) * LEG_RECT_SIZE +
          legSpacing.v * Math.floor(i / LEG_EL_PER_ROW)) +
        ")"
      );
    });

  legG
    .append("rect")
    .attr("width", LEG_RECT_SIZE)
    .attr("height", LEG_RECT_SIZE)
    .attr("class", "legend-item")
    .attr("fill", (c) => colors(c));

  legG
    .append("text")
    .attr("x", LEG_RECT_SIZE + legTxtOffset.x)
    .attr("y", LEG_RECT_SIZE + legTxtOffset.y)
    .attr("fill", "#fff")
    .text((c) => c);
}


updatePage();