const width  = 800;
const height =  650;
const maxavgprice = 300;
const heightCabecera = 60;
const posxCabecera = 10;
const posyCabecera = 40;

const input = [5, 10, 15, 20];
const maxInput = d3.max(input);
const rectWidth = 20;

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


d3.json(urljson).then((featureCollection) => {
  	d3.csv(urlcsv).then(function (data) {
        data.forEach(function (d) {
        	  d.neighbourhood = d.neighbourhood;
            d.bedrooms = d.bedrooms;
            d.total = +d.total;
            //console.log(d);
            return d;
        })
        console.log(data[0]);
        drawMap(featureCollection,data, groupMap);
    })
    
  })
  .catch((error) => {
    		throw error;
});

function drawLeyend(name, price) {
 

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

 

  const textCabecera = groupCabecera.append('text');
  textCabecera
    .attr('x', posxCabecera)
    .attr('y', posyCabecera + heightCabecera/2)
    .attr('fill', 'purple')
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
function drawGraph(barrio, groupGraph,data)
{
  console.log('drawGraph')
  console.log(data);
  console.log(barrio)

  const width = 400;
  const height = 400;

  groupGraph.attr('width', width)
    .attr('height', height);


  const xscale = d3.scaleLinear()
    .domain([0, d3.max(input)])
    .range([0, width ]);

  const yscale = d3.scaleLinear()
    .domain([0, d3.max(input)])
    .range([height, 0]);

  const x_axis = d3.axisBottom()
    .scale(xscale);

  const y_axis = d3.axisLeft()
    .scale(yscale);  

  groupGraph.append("g")
     .attr("transform", "translate(50, 10)")
     .call(y_axis);

  const xAxisTranslate = height + 10;

  groupGraph.append("g")
    .attr("transform", "translate(50, " + xAxisTranslate  +")")
    .call(x_axis);
      

  const rect = groupGraph.selectAll('rect')
    .data(input)
    .enter()
    .append('rect');

  rect.attr('class', (d)=> {
    if (d > 10){
      return 'rectwarning';
    }
  })

  rect
    .attr('x', posX)
    .attr('y', (d) => height - scale(d))
    .attr('width', rectWidth)
    .attr('height', scale);  // attr('height', (d) => scale(d))


  const text = groupGraph
    .selectAll('text')
    .data(input)
    .enter()
    .append('text');

  text.text(d=>d)
    .attr('x', posX)
    .attr('y', (d) => posY(d) - 25 ); // para subir se resta

  text.attr('class', (d) =>{
    if (d > 10){
      return 'text rectwarning';
    }
    return 'text';
  })

}

function scale(d) {
  const scaleNum = (height - 20) / maxInput;
  return scaleNum * d;
}

function posX(d, index) {
  return index * (rectWidth + 1);
}

function posY(d) {
  return height - scale(d);
}

function drawGraph1(barrio, groupGraph,datagraph)
{
  console.log('drawGraph1')
  console.log(datagraph);
  console.log(barrio)

  const widthgraph = 500;
  const heightgraph = 500;

  groupGraph.selectAll('g')
    .remove()
    .exit();

  groupGraph.attr('width', widthgraph)
    .attr('height', heightgraph)
    .attr('transform', `translate(100, 50)`);

  const xScale = d3.scaleBand()
    .domain(datagraph.map(function(d){return d.bedrooms;}))
    .range([0, widthgraph]);

   
  const xAxis = groupGraph.append('g')
    .attr('id', 'xAxis')
    .attr('transform', `translate(0, ${heightgraph})`)
    .call(d3.axisBottom(xScale));

  
  const yScale = d3.scaleLinear()
    //.domain([0,d3.max(datagraph, d => d3.max(d, +d.total))])
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
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return xScale(d.bedrooms); })
    .attr('y', function(d) { return yScale(+d.total); })
    .attr('width', xScale.bandwidth())
    .attr('height', function(d) { return heightgraph - yScale(+d.total); });
    //.attr('transform', `translate(0, ${heightgraph})`);

  groupGraph.append('text')
   .attr('transform', 'translate(100,0)')
   .attr('x', 50)
   .attr('y', 50)
   .attr('font-size', '24px')
   .text('Texto Prueba');

  groupGraph.append('g')
   .attr('transform', `translate(300, ${heightgraph +50} )`)
   //.call(d3.axisBottom(xScale))
   .append('text')
   //.attr('y', heightgraph  - 250)
   //.attr('x', widthgraph  - 200)
   .attr('text-anchor', 'end')
   .attr('stroke', 'black')
   .text('N Habitaciones');
   
  groupGraph.append('g')
   //.call(d3.axisLeft(yScale)
   //.tickFormat(function(d){
   //    return + d;
   //}).ticks(10))
   .attr('transform', `translate(0, ${heightgraph/3} )`)
   .append('text')
   .attr('transform', 'rotate(-90)')
   .attr('y', 6)
   .attr('dy', '-5.1em')
   .attr('text-anchor', 'end')
   .attr('stroke', 'black')
   .text('Nº Viviendas');

/*
  console.log('d.bedrooms');
  console.log(datagraph.bedrooms);
  rects.selectAll("rect")
    .data(datagraph)
    .enter()
    .append('rect')
    .attr('x', d => xScale(xValue(d)))
    .attr('y', d=> yScale(yValue(d)))
*/
    
    //.attr("height", d=> yScale(d[0]) - yScale(d[1]))
    //.attr("width", xScale.bandwidth())  


}



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
    	.append('path');

    neighbourhoodsPath.attr('d', pathProjection);

    neighbourhoodsPath.on('click', clickNeighbourhood)
    	.on('mouseover', mouseoverNeighbourhood)
    	.on('mouseleave', mouseleaveNeighbourhood);

    function clickNeighbourhood(d, i) {
        //d.opacity = d.opacity ? 0 : 1;
      //d3.select(this).attr('opacity', d.opacity);
      
      console.log(d.properties.name);
      drawLeyend(d.properties.name, d.properties.avgprice);
      console.log('1-----------------');
      console.log(data);

      const neighbourselect = d.properties.name;
      /*
      const datagraph = data.filter(function(d){
        console.log('2-----' + d.neighbourhood + ' ' + neighbourselect);
        return d.neighbourhood == neighbourselect;}*/
      const datagraph = data.filter(
        //datos => datos.neighbourhood ==barrioSeleccionado
        datos => datos.neighbourhood == neighbourselect
      );

      //console.log('filter');
      //console.log(neighbourselect);
      //console.log(datagraph);
      drawGraph1(d.properties.name, groupGraph,datagraph);
      //drawGraph(d.properties.name, groupGraph,datagraph);
      
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
        .attr('x', posX+150)
        .attr('y', 40)
        .text(d => `${index}`);

    }
    legend.attr("transform", `translate(150,0)`);
    gmap.attr("transform", `translate(-150,0)`);
}