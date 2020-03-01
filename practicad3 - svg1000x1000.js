console.log('init practicad3.js');

// Código válido para cualquier geojson (bastaría cambiar la url)

// Cargar el json
const urljson = 'https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json';

const width = 1000;
const height =  1000;
const maxavgprice = 300;
const widthCabecera = 550;
const heightCabecera = 50;
const posxCabecera = 10;
const posyCabecera = 100;

const svg = d3.select('#mapd3')
  .append('svg');

d3.json(urljson)
  .then((featureCollection) => {			
  	 drawMap(featureCollection);
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
    .attr('x', posxCabecera)
    .attr('y', posyCabecera)
    .attr('width', widthCabecera)
    .attr('height', heightCabecera)
    .attr('fill', 'white');

  console.log(rectCabecera);
  console.log('rectCabecera');

  const textCabecera = groupCabecera.append('text');
  textCabecera
    .attr('x', posxCabecera)
    .attr('y', posyCabecera + (heightCabecera/2))
    .text(d => descCabecera);

}

 function clickNeighbourhood(d, i) {
      //d.opacity = d.opacity ? 0 : 1;
    //d3.select(this).attr('opacity', d.opacity);
    console.log(this);
    console.log('neighbourhoods');
/*    d3.select(this)
      .transition()
      .duration(100)
      .atrr('fill', 'red');*/
    drawLeyend(d.properties.name, d.properties.avgprice);   
 }

function drawMap(featureCollection) {

    svg.attr('width', width)
       .attr('height', height);

    // Proyección
    const center = d3.geoCentroid(featureCollection);  
    const projection = d3.geoMercator()
       .fitSize([width ,height], featureCollection)
       .center(center)
       .translate([width/2, height/2 + 100]);		// Punto central del mapa   

    // Uso de la proyección
    const pathProjection = d3.geoPath().projection(projection);

    // Pintar las coordenadas del json
    const features = featureCollection.features;
    // console.log(features);

    const groupMap = svg.append('g').attr('class', 'map');

    // Pintar el mapa
    const neighbourhoodsPath = svg.selectAll('.neighbourhoods')
    	.data(features)
    	.enter()
    	.append('path');

    neighbourhoodsPath.attr('d', pathProjection);

    neighbourhoodsPath.on('click', clickNeighbourhood);


/*     .on('mouseover', function(d, i) {
          // make the mouseover'd element
          // bigger and red
          d3.select(this)
            .transition()
            .duration(100)
            .attr('hover', 'red');
     })
     
     .on('mouseout', function(d, i) {
          // return the mouseover'd element
          // to being smaller and black
          d3.select(this)
            .transition()
            .duration(100);

    })
*/

    // Color al mapa por barrio
    // const color = d3.scaleOrdinal(d3.schemeCategory10);
    color = d3.scaleQuantize([0, maxavgprice], d3.schemeBlues[6])
    neighbourhoodsPath.attr('fill', (d) => color(d.properties.avgprice))
    	  // Leyenda con el precio (rectángulo)
	  const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('title', 'AVG Price');

	  // d3.legendcolor

	  // Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	  const numberOfLegends = 6;

	  const scaleLegend = d3.scaleLinear()
	     .domain ([0, maxavgprice])
	     .range ([0, width]);

	  for (let index = 0; index < maxavgprice; index += maxavgprice/numberOfLegends) {
		   console.log(index);
		   const posX = scaleLegend(index);
		   const legendGroup = legend
			   .append('g')
			   .attr('transform', `translate (${posX}, 20) `);

		   const rectColor = legendGroup
			   .append('rect');

		   const widthRect = (width/numberOfLegends) -2;
		   rectColor
			   .attr('width', widthRect)
			   .attr('height', 15)
			   .attr('fill', color(index));

       const textLegend = groupMap.append('text');
       textLegend
        .attr('x', posX)
        .attr('y', 50)
        .text(d => `${index}`);

    }

     
}


function drawGraph(featureCollection) {
    const svg = d3.select('#graphd3')
      .append('svg');

    //svg.attr('width', width)
    //   .attr('height', height);

}
