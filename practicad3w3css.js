const width  = 800;
const height =  650;
const maxavgprice = 300;
const heightCabecera = 60;
const posxCabecera = 10;
const posyCabecera = 40;

const svg = d3.select('#map')
   .append('svg');

const svggraph = d3.select('#graph')
   .append('svg');

svg.attr('width', width)
   .attr('height', height);

svggraph.attr('width', width)
   .attr('height', height);


const groupMap = svg.append('g');

const groupGraph = svggraph.append('g');

// Cargar el json
const urljson = 'https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json';

// Cargar el csv
const urlcsv = 'https://gist.githubusercontent.com/olgaalvaro/915a0740f47d75e40f9fc3ef28943ec1/raw/1d772883a16a211d40079080b9ce9261cb249978/airbnbmadridbyneighbourhood';

// Json y Csv
d3.json(urljson).then((featureCollection) => {
  	d3.csv(urlcsv).then(function (data) {
        data.forEach(function (d) {
        	  d.neighbourhood = d.neighbourhood;
            d.bedrooms = d.bedrooms;
            d.total = +d.total;
            //console.log(d);
            return d;
        })
        // Función pinta el mapa de Madrid
        drawMap(featureCollection,data, groupMap);
    })
    
  })
  .catch((error) => {
    		throw error;
});

// Mostrar la leyenda del barrio seleccionado
function drawLeyend(name, price) {
 

  const descCabecera = `Barrio: ${name} (Precio: ${price})`;

  const groupCabecera = svg.append('g').attr('class', 'cabecera');

  const rectCabecera = groupCabecera
    .append('rect');


  rectCabecera
    .attr('x', 0)
    .attr('y', posyCabecera)
    .attr('width', width)
    .attr('height', heightCabecera)
    .attr('fill', 'white');

  
  const textCabecera = groupCabecera.append('text');
  textCabecera
    .attr('x', posxCabecera)
    .attr('y', posyCabecera + heightCabecera/2)
    .text(d => descCabecera);
}


function mouseoverNeighbourhood(d, i){
	d3.select(this)
      .transition()
      .duration(200)
      .attr('fill', 'purple');
}


function mouseleaveNeighbourhood(d, i){
	d3.select(this)
      .transition()
      .duration(200)
      .attr('fill', (d) => color(d.properties.avgprice));
}

// Pintar el char bart con la información del total viviendas por nº de habitaciones
// según el barrio seleccionado
function drawGraph(barrio, groupGraph,datagraph)
{
  console.log('drawGraph')
  console.log(datagraph);
  console.log(barrio)

  const widthgraph = 500;
  const heightgraph = 500;

  groupGraph.selectAll('g')
    .remove()
    .exit();

  groupGraph.selectAll('text')
    .remove()
    .exit();


  groupGraph.attr('width', widthgraph)
    .attr('height', heightgraph)
    .attr('transform', `translate(100, 100)`);

  const xScale = d3.scaleBand()
    .domain(datagraph.map(function(d){return d.bedrooms;}))
    .range([0, widthgraph])
    .paddingInner(0.05);

   
  const xAxis = groupGraph.append('g')
    .attr('id', 'xAxis')
    .attr('transform', `translate(0, ${heightgraph})`)
    .call(d3.axisBottom(xScale));

  
  const yScale = d3.scaleLinear()
    .domain([0,d3.max(datagraph,function (d) { return +d.total}) ])
    .range([heightgraph,0]);


  const yAxis = groupGraph.append('g')
    .attr('id', 'yAxis')
    .call(d3.axisLeft(yScale));


  const barchart = groupGraph.selectAll('.bar')
    .remove()
    .exit()
    .data(datagraph);
  
  barchart
    .data(datagraph)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return xScale(d.bedrooms); })
    .attr('y', function(d) { return yScale(+d.total); })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) { return heightgraph - yScale(+d.total); });
/*
  barchart.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0, ${heightgraph })`)
    .call(d3.axisBottom()
        .scale(xScale)
        .tickSize(-heightgraph , 0, 0)
        .tickFormat(''));

  barchart.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft()
        .scale(yScale)
        .tickSize(-widthgraph , 0, 0)
        .tickFormat(''));

        https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

*/

  const labels = groupGraph.selectAll('.labelbar')    
    .data(datagraph)
    .enter()
    .append('text')
    .attr('class','labelbar')
    .attr('x', function(d) { return xScale(d.bedrooms) + (xScale.bandwidth()/2); })
    .attr('y', function(d) { return yScale(+d.total) -10 ; })
    .text(function(d) { return '  ' +d.total; });     


  groupGraph.append('text')
   .attr('class', 'titlebarchart')
   .attr('x', 0)
   .attr('y', 0)
   .attr('transform', 'translate(0,-50)')
   .text(`Bar Chart: ${barrio}`);

  groupGraph.append('g')
   .attr('class', 'xtitlebc')
   .attr('transform', `translate(300, ${heightgraph +40} )`)
   .append('text')
   .text('Nº Habitaciones');
   
  groupGraph.append('g')
   .attr('class', 'ytitlebc')
   .attr('transform', `translate(0, ${heightgraph/3} )`)
   .append('text')
   .attr('transform', 'rotate(-90)')
   .attr('y', 6)
   .attr('dy', '-5.1em')
   .text('Nº Viviendas');

}


// Pintar el mapa de Madrid 
function drawMap(featureCollection,data, gmap) { 

	// Proyección
    const center = d3.geoCentroid(featureCollection);  
    const projection = d3.geoMercator()
       .fitSize([width-100, height-100], featureCollection)
       .center(center)

       .translate([width/2, height/2 + 65]);
       //.translate([width/4, height/2 - 50]);		// Punto central del mapa   

    // Uso de la proyección
    const pathProjection = d3.geoPath().projection(projection);

    // Pintar las coordenadas del json
    const features = featureCollection.features;

    // Pintar el mapa
    const neighbourhoodsPath = gmap.selectAll('.neighbourhoods')
    	.data(features)
    	.enter()
    	.append('path')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);

    neighbourhoodsPath.attr('d', pathProjection);

    neighbourhoodsPath.on('click', clickNeighbourhood)
    	.on('mouseover', mouseoverNeighbourhood)
    	.on('mouseleave', mouseleaveNeighbourhood);

    function clickNeighbourhood(d, i) {
      // Pintar la leyenda sobre el mapa
      drawLeyend(d.properties.name, d.properties.avgprice);

      // Filtrar los datos del csv según el barrio seleccionado
      const neighbourselect = d.properties.name;
      const datagraph = data.filter(
        datos => datos.neighbourhood == neighbourselect
      );

      // Pintar el bar chart con los datos del barrio seleccionado
      drawGraph(d.properties.name, groupGraph,datagraph);
      
   }
  
  // Color al mapa por barrio
	// Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	const numberOfLegends = 6;
    color = d3.scaleQuantize([0, maxavgprice], d3.schemeBlues[numberOfLegends])
    neighbourhoodsPath.attr('fill', (d) => color(d.properties.avgprice))
  
  // Leyenda con el precio (rectángulo)
	const legend = gmap.append('g')
	  .attr('class', 'legend')
	  .attr('title', 'AVG Price');


	// Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	const scaleLegend = d3.scaleLinear()
	  .domain ([0, maxavgprice])
	  .range ([0, width/2]);

	  for (let index = 0; index < maxavgprice; index += maxavgprice/numberOfLegends) {
		   // console.log(index);
		   const posX = scaleLegend(index);
		   const legendGroup = legend
			   .append('g')
			   .attr('transform', `translate (${posX}, 10) `);

		   const rectColor = legendGroup
			   .append('rect');

		   const widthRect = (width/(2*numberOfLegends));
		   rectColor
			   .attr('width', widthRect)
			   .attr('height', 15)
			   .attr('fill', color(index));

       const textLegend = gmap.append('text');
       textLegend
        .attr('x', posX+150)
        .attr('y', 40)
        .text(d => `${index}`);

    }
    legend.attr("transform", `translate(150,0)`);
    gmap.attr("transform", `translate(-150,0)`);
}