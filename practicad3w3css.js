const width  = 800;
const height =  650;
const maxavgprice = 300;
const heightCabecera = 60;
const posxCabecera = 10;
const posyCabecera = 40;

const input = [5, 10, 15, 20];
const maxInput = d3.max(input);
const rectWidth = 20;
const heightgraph = 200;

const svg = d3.select('#map')
   .append('svg');

svg.attr('width', width)
   .attr('height', height);

const svggraph =  d3.select('#graph')
   .append('svg');


const groupMap = svg.append('svg');

// Cargar el json
const urljson = 'https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json';

// Cargar el csv
const urlcsv = 'https://gist.githubusercontent.com/olgaalvaro/40ef4b78139c390509e67c3ff7b421ee/raw/6e6ec6c556fdab1cdc7c7f79e4042032513a0e28/agrupacion_bedrooms_totalviviendas.csv';


d3.json(urljson).then((featureCollection) => {
  	d3.csv(urlcsv).then(function (data) {
        data.forEach(function (d) {
        	//const datafilter = d3.csv.filter(f => f.neighbourhood == 'Acacias');
            d.neighbourhood = d.neighbourhood;
            d.bedrooms = d.bedrooms;
            d.total = +d.total;
            return d;
        })
        console.log(data);
        console.log('data');
    })
    drawMap(featureCollection, groupMap);
  })
  .catch((error) => {
    		throw error;
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

function drawGraph(name, sgraph){
	console.log(name);
	console.log(sgraph);

 	/*sgraph
 		.selectAll('rect')
		.remove()
		.exit();*/

	const rectgraph = sgraph.selectAll('rect')
		.data(input)
		.enter()
		.append('rect');

  console.log(name);
  rectgraph
    	.attr('x',  posX)
	    .attr('y', posY)
	    .attr('width', rectWidth)
	    .attr('height', scale)
	    .attr('fill', 'blue');
	    //.attr('transform', 'translate(1000, 500)');
   
   console.log(rectgraph);    

   const text = sgraph.selectAll('text')
	   .data(input)
	   .enter()
	   .append('text');

	text.text(d => d)
	   .attr('x', posX)
  	   .attr('y', (d) => posY(d) - 3);
       //.attr('transform', 'translate(1000, 500)');

	text.attr('class', (d) => {
  	   if (d > 10) {
    		return 'text rectwarning';
  	   }
  	return 'text';
	})

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
    drawGraph(d.properties.name, svggraph);
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
       .fitSize([width, height], featureCollection)
       .center(center)
       .translate([width/2, height/2 + 65]);
       //.translate([width/4, height/2 - 50]);		// Punto central del mapa   

    // Uso de la proyección
    const pathProjection = d3.geoPath().projection(projection);

    // Pintar las coordenadas del json
    const features = featureCollection.features;

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
			   .attr('transform', `translate (${posX}, 10) `);

		   // console.log(index);	   	
		   const rectColor = legendGroup
			   .append('rect');

		   const widthRect = (width/(2*numberOfLegends));
		   rectColor
			   .attr('width', widthRect)
			   .attr('height', 15)
			   .attr('fill', color(index));

       const textLegend = gmap.append('text');
       textLegend
        .attr('x', posX)
        .attr('y', 40)
        .text(d => `${index}`);

    }
}

