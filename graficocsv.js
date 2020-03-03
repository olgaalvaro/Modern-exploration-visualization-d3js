const margin = 80;
const width = 840;
const height = 440;

const svg = d3.select('#practicad3')
  .append('svg');

svg.attr('width', width)
   .attr('height', height);


const urlcsv = 'https://gist.githubusercontent.com/olgaalvaro/40ef4b78139c390509e67c3ff7b421ee/raw/6e6ec6c556fdab1cdc7c7f79e4042032513a0e28/agrupacion_bedrooms_totalviviendas.csv';

function drawText(id, data) {


    d3.select(id)
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("y", (d,i) => i * 20 + 20)
      .attr("x", 10)
      .text((d) => d.neighbourhood + " " + d.bedrooms + " " + d.total);
 }

/*
d3.csv(urlcsv)
  	.then(function (data) {
        data.forEach(function (d) {
            d.neighbourhood = d.neighbourhood;
            d.bedrooms = d.bedrooms;
            d.total = +d.total;
            return d;
        })
        console.log(data[0]);
        console.log('data0');
        //drawText('Acacias', data);
    })
    .catch((error) => {
    		throw error;
    });
*/


d3.csv(urlcsv).then(d => chart(d));

function chart(csv) {

    const options = d3.select("#neighbour").selectAll("option")
        .data(csv)
        .enter()
        .append("option")
        .text(d => d);

    const x = d3.scaleBand()
        .range([margin.left, width - margin.right]);
        
    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top]);


    const xAxis = g => g
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))

    const yAxis = g => g
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y))

    svg.append("g")
        .attr("class", "x-axis")

    svg.append("g")
        .attr("class", "y-axis")

    update(d3.select("#neighbour"), 0);

    function update(neighbourhood, speed) {

        const data = csv.filter(f => f.neighbourhood == neighbourhood);
        
        y.domain([0, d3.max(data, d => d.total)]);

        svg.selectAll(".y-axis").transition().duration(speed)
                .call(yAxis);

        x.domain([0, d3.max(data, d => d.bedrooms)]);

        svg.selectAll(".x-axis").transition().duration(speed)
            .call(xAxis)

        const bar = svg.selectAll(".bar")
            .data(data, d => d.bedrooms)

        bar.exit().remove();

        bar.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "steelblue")
            .attr("width", x.bandwidth())
            .transition().duration(speed)
            .attr("x", d => x(d.bedrooms))
            .attr("y", d => y(d.total))
            .attr("height", d => y(0) - y(d.total));
    }

update('Acacias', 750);
}