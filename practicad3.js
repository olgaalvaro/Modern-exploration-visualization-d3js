const width  = 800;
const height =  650;
const marginleft = 150;
const marginleftmap = 100;
const yposinimap = 65;
const heightCabecera = 50;
const posxCabecera = 10;
const posyCabecera = 10;

const widthgraph = 500;
const heightgraph = 500;
const topgraph = 40;
const posinigraph = 100;

const widthlegend = 500;
const heightlegend = 100;
const toplabel = 10;
const xtitlelabel = 300;

// SVG para el mapa
const svg = d3.select('#map')
   .append('svg');

// SVG para el bar chart
const svggraph = d3.select('#graph')
   .append('svg');

svg.attr('width', width)
   .attr('height', height);

svggraph.attr('width', width)
   .attr('height', height);

// Grupo Map del SVG del mapa
const groupMap = svg.append('g');

// Grupo Graph del SVG del bar chart
const groupGraph = svggraph.append('g');

// Cargar el json
const urljson = 'https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json';

// Cargar el csv
const urlcsv = 'https://gist.githubusercontent.com/olgaalvaro/915a0740f47d75e40f9fc3ef28943ec1/raw/59ad38733b6dd93058e1ed68c3db5a4c107d6595/airbnbmadrid_counthousesbybedrooms';

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

  // Group Cabecera
  const groupCabecera = svg.append('g').attr('class', 'cabecera');

  const rectCabecera = groupCabecera
    .append('rect');

  rectCabecera
    .attr('x', posxCabecera)
    .attr('y', posyCabecera)
    .attr('width', width)
    .attr('height', heightCabecera)
    .attr('fill', 'orange');

  const textCabecera = groupCabecera.append('text');
  textCabecera
    .attr('x', posxCabecera + marginleftmap)
    .attr('y', posyCabecera + heightCabecera/2)
    .text(d => descCabecera);
}


// Pintar el char bart con la información del total viviendas por nº de habitaciones
// según el barrio seleccionado
function drawGraph(barrio, groupGraph,datagraph)
{
  //console.log('drawGraph')
  //console.log(datagraph);
  //console.log(barrio)

  // Eliminamos el grupo Map con todos los elementos y texto cada vez que se selecciona un barrio
  groupGraph.selectAll('g')
    .remove()
    .exit();

  groupGraph.selectAll('text')
    .remove()
    .exit();

  groupGraph.attr('width', widthgraph)
    .attr('height', heightgraph)
    .attr('transform', `translate(${posinigraph}, ${posinigraph})`);

  // Escala Band Eje X
  const xScale = d3.scaleBand()
    .domain(datagraph.map(function(d){return d.bedrooms;}))
    .range([0, widthgraph])
    .paddingInner(0.05);
   
  const xAxis = groupGraph.append('g')
    .attr('id', 'xAxis')
    .attr('transform', `translate(0, ${heightgraph})`)
    .call(d3.axisBottom(xScale));

  // Escala Linear Eje Y
  const yScale = d3.scaleLinear()
    .domain([0,d3.max(datagraph,function (d) { return +d.total}) ])
    .range([heightgraph,0]);

  const yAxis = groupGraph.append('g')
    .attr('id', 'yAxis')
    .call(d3.axisLeft(yScale));

  // Elementos el gráfico de barras (bar chart)
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

  // Etiquetas con los totales de las viviendas
  const labels = groupGraph.selectAll('.labelbar')    
    .data(datagraph)
    .enter()
    .append('text')
    .attr('class','labelbar')
    .attr('x', function(d) { return xScale(d.bedrooms) + (xScale.bandwidth()/2); })
    .attr('y', function(d) { return yScale(+d.total) - toplabel  ; })
    .text(function(d) { return '  ' +d.total; });     

  // Título del Bar Char indicando el barrio seleccionado  
  groupGraph.append('text')
   .attr('class', 'titlebarchart')
   .attr('x', 0)
   .attr('y', 0)
   .attr('transform', `translate(0,-${heightCabecera})`)
   .text(`Bar Chart: ${barrio}`);

  // Título del eje X
  groupGraph.append('g')
   .attr('class', 'xtitlebc')
   .attr('transform', `translate(${xtitlelabel}, ${heightgraph + topgraph} )`)
   .append('text')
   .text('Nº Habitaciones');
  
  // Título del eje Y
  groupGraph.append('g')
   .attr('class', 'ytitlebc')
   .attr('transform', `translate(0, ${heightgraph/3} )`)
   .append('text')
   .attr('transform', 'rotate(-90)')
   .attr('y', 6)
   .attr('dy', '-3.1em')
   .text('Nº Viviendas');


}


// Pintar el mapa de Madrid 
function drawMap(featureCollection,data, gmap) { 

	// Proyección
  const center = d3.geoCentroid(featureCollection);  
  const projection = d3.geoMercator()
    .fitSize([width-marginleftmap, height-marginleftmap], featureCollection)
    .center(center)
    .translate([width/2, height/2 + yposinimap]);

  // Uso de la proyección
  const pathProjection = d3.geoPath().projection(projection);

  // Pintar las coordenadas del json
  const features = featureCollection.features;

  // Cálculamos el máximo avgprice del json
  const maxavgprice = d3.max(features, function(d) { return d.properties.avgprice; });

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

      function mouseoverNeighbourhood(d, i){
      d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', 'red');
    }


    function mouseleaveNeighbourhood(d, i){
      d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', (d) => color(d.properties.avgprice));
    }

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

  // Nº de divisiones de las leyendas
	const numberOfLegends = 7;
  
  // Treshold Scale Legend
  const color = d3.scaleThreshold()
    .domain([40, 80, 120, 160, 200, 240, maxavgprice])
    .range(d3.schemeYlGnBu[numberOfLegends]);

  neighbourhoodsPath.attr('fill', (d) => color(d.properties.avgprice))
  
  // Leyenda con el precio (rectángulo)
	const legend = gmap.append('g')
	  .attr('class', 'legend')
	  .attr('title', 'AVG Price');


	// Escala lineal con 6 rectangulos en base al max del precio medio por barrio
	const scaleLegend = d3.legendColor()
    .scale(color);

  const legendGroup = legend
    .append('g')
    .attr('transform', `translate (${widthlegend}, ${heightlegend}) `)
    .call(scaleLegend);

  legend.attr('transform', `translate(${marginleftmap},0)`);
  gmap.attr('transform', `translate(${-marginleftmap},0)`);
}