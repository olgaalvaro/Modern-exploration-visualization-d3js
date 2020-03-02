    const   svg = d3.select("svg"),
            margin = 200,
            width = 600,
            height = 500;

    svg.append("text")
       .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "24px")
       .text("XYZ Foods Stock Price");

    const xScale = d3.scaleBand().range([0, width]).padding(0.4),
          yScale = d3.scaleLinear().range([height, 0]);

    const g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    const urlcsv = 'https://github.com/olgaalvaro/Modern-exploration-visualization-d3js/blob/master/DATA/agrupacion_bedrooms_totalviviendas.csv';       
    d3.csv(urlcsv, function(error, data) { 
        if (error) {
            console.log(error);
        }

        xScale.domain(function(d) { return d.bedrooms; });
        yScale.domain([0, d3.max(data, function(d) { return +d.total; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Year");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return "$" + d;
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Stock Price");

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.bedrooms); })
         .attr("y", function(d) { return yScale(d.total); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d.value); });
    });