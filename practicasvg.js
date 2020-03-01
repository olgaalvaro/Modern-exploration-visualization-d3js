console.log('init prueba.js');

const svg = d3.select('#mapd3')
  .append('svg');

svg.attr('width', '100%')
   .attr('height', 2000);

svg.append("line")
   .attr("x1", 1100)
   .attr("y1", 1100)
   .attr("x2", 1200) 
   .attr("y2", 1200)
   .style("stroke", "rgb(255,0,0)")
   .style("stroke-width", 2);


svg.append("rect")
            .attr("x", 1575)
            .attr("y", 20)
            .attr("width", '50%')
            .attr("height", 1000)
            .attr("fill", "green");


