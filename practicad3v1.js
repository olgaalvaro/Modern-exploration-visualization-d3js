console.log('init prueba.js');

// Cargar el json
const urljson = 'https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json';

// Cargar el csv
const urlcsv = 'https://github.com/olgaalvaro/Modern-exploration-visualization-d3js/blob/master/DATA/agrupacion_bedrooms_totalviviendas.csv';

// Constantes
const height =  2000;
const width  =  2500; 
const maxavgprice = 300;
//const widthCabecera = 550;
const heightCabecera = 100;
const posxCabecera = 10;
const posyCabecera = 100;

//const input = [5, 10, 15, 20];
const input = [5];
const maxInput = d3.max(input);
const rectWidth = 20;
const heightgraph = 200;

const svg = d3.select('#practicad3')
  .append('svg');

svg.attr('width', '100%')
   .attr('height', height);

// Grupo para el dibujar el mapa
const groupMap = svg.append('g')
	.attr('class', 'map')
	.attr('width', width/2 -20)
	.attr('height', height)
	.attr('fill', 'white')
	.attr('stroke', 'black')
	.attr('stroke-width', 2);

// Grupo para el dibujar el gráfico
const groupGraph = svg.append('rect')
groupGraph
	.attr('class', 'graph')
	.attr('width', width/2 - 20)
	.attr('height', height)
	.attr('fill', 'orange')
	.attr('stroke', 'black')
	.attr('stroke-width', 2)
	.attr('transform', 'translate(1250, 0)');

d3.json(urljson)
  .then((featureCollection) => {	
  	 d3.csv(urlcsv)
  	 	.then((urlcsv) => {
  	 		drawMap(featureCollection, groupMap);
  	 		// function(d) { data.set(d.neighbourhood, d.bedrooms +d.total); }
  	 	})		
  	 //drawMap(featureCollection, groupMap);
     // drawGraph(featureCollection);
     //console.log(featureCollection);		// bpi con los datos fecha y el valor del bitcon 
  })
  .catch((error) => {
    console.log('error', error);
  });


function drawLeyend(name, price) {
  console.log('drawLegend');
  console.log(name);
  console.log(price);

  const descCabecera = `Barrio: ${name} (Precio: ${price})`;

  const groupCabecera = svg.append('g').attr('class', 'cabecera');
  const rectCabecera = groupCabecera
    .append('rect');

  rectCabecera
    .attr('x', 0)
    .attr('y', posyCabecera)
    .attr('width', width/2)
    .attr('height', heightCabecera)
    .attr('fill', 'white');

  console.log(rectCabecera);
  console.log('rectCabecera');

  const textCabecera = groupCabecera.append('text');
  textCabecera
    .attr('x', posxCabecera)
    .attr('y', posyCabecera + heightCabecera/2)
    .attr('fill', 'purple')
    .text(d => descCabecera);

}

function drawGraph(name,ggraph) {

  const rectgraph = ggraph.selectAll(".graph")
	.data(input)
	.enter()
	.append('rect');

  console.log(name);
  rectgraph
    	.attr('x',  posX)
	    .attr('y', posY)
	    .attr('width', rectWidth)
	    .attr('height', scale)
	    .attr('fill', 'blue')
	    .attr('transform', 'translate(1250, 500)');
   
   console.log(rectgraph);    
/*  
   const text = groupGraph.selectAll('text')
	   .data(input)
	   .enter()
	   .append('text');

	text.text(d => d)
	   .attr('x', posX)
  	   .attr('y', (d) => posY(d) - 3);

	text.attr('class', (d) => {
  	   if (d > 10) {
    		return 'text rectwarning';
  	   }
  	return 'text';
	})
*/
}

function scale(d) {
  const scaleNum = (heightgraph - 20) / maxInput;
  return scaleNum * d;
}

function posX(d, index) {
  return index * (rectWidth + 1);
}

function posY(d) {
  return heightgraph - scale(d);
}


function clickNeighbourhood(d, i) {
      //d.opacity = d.opacity ? 0 : 1;
    //d3.select(this).attr('opacity', d.opacity);
    console.log(this);
    console.log('neighbourhoods');

    drawLeyend(d.properties.name, d.properties.avgprice);   
    drawGraph(d.properties.name, groupGraph);
    console.log('drawGraph')
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
function drawMap(featureCollection, gmap) { 

    // Proyección
    const center = d3.geoCentroid(featureCollection);  
    const projection = d3.geoMercator()
       .fitSize([width/2 -100,height], featureCollection)
       .center(center)
       .translate([width/4, height/2 - 50]);		// Punto central del mapa   

    // Uso de la proyección
    const pathProjection = d3.geoPath().projection(projection);

    // Pintar las coordenadas del json
    const features = featureCollection.features;
    // console.log(features);

    //const groupMap = svg.append('g').attr('class', 'map');

    // Pintar el mapa
    const neighbourhoodsPath = svg.selectAll('.neighbourhoods')
    	.data(features)
    	.enter()
    	.append('path');

    neighbourhoodsPath.attr('d', pathProjection);

    neighbourhoodsPath.on('click', clickNeighbourhood)
    	.on('mouseover', mouseoverNeighbourhood)
    	.on('mouseleave', mouseleaveNeighbourhood);

    // Color al mapa por barrio
	// Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	const numberOfLegends = 6;
    color = d3.scaleQuantize([0, maxavgprice], d3.schemeBlues[numberOfLegends])
    neighbourhoodsPath.attr('fill', (d) => color(d.properties.avgprice))
    // Leyenda con el precio (rectángulo)
	const legend = svg.append('g')
	  .attr('class', 'legend')
	  .attr('title', 'AVG Price');

	// d3.legendcolor

	// Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	const scaleLegend = d3.scaleLinear()
	  .domain ([0, maxavgprice])
	  .range ([0, width/2]);

	  for (let index = 0; index < maxavgprice; index += maxavgprice/numberOfLegends) {
		   // console.log(index);
		   const posX = scaleLegend(index);
		   const legendGroup = legend
			   .append('g')
			   .attr('transform', `translate (${posX}, 20) `);

		   // console.log(index);	   	
		   const rectColor = legendGroup
			   .append('rect');

		   const widthRect = (width/(2*numberOfLegends));
		   rectColor
			   .attr('width', widthRect)
			   .attr('height', 20)
			   .attr('fill', color(index));

       const textLegend = gmap.append('text');
       textLegend
        .attr('x', posX)
        .attr('y', 60)
        .text(d => `${index}`);

    }
}