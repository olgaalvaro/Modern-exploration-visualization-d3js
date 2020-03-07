# Modern-exploration-visualization-d3js


### Práctica

Tomando los datos de los precios de airbnb:
1. Crear un mapa con los barrios de la ciudad de Madrid y pintarlos por colores según el precio medio del alquiler en el barrio.
2. Crear una gráfica que en el eje Y tenga el número de propiedades y en el eje X el número de habitaciones de un barrio (Se puede tomar un barrio  solo, pero sería recomendable que al hacer click en el mapa los datos de la gráfica cambien)

Los ficheros utilizados para la práctica son:

**Fichero hltm** *practicad3.htlm*  
Las librerias utilizadas en este fichero htlml son:
- https://d3js.org/d3.v5.min.js  D3 (or D3.js) is a JavaScript library for visualizing data using web standards
  
- https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js  
  A legend component for d3. Given a d3.scale it can create either a color legend, size legend, or symbol legend.
  
**Fichero css** *maind3.css*  
Fichero externo con la hoja de estilo utilizada para los ficheros practicad3.html y practicad3.js

**Fichero css** *w3.css*  
W3.CSS is a CSS framework with built-in responsiveness https://www.w3schools.com/w3css/4/w3.css  
Utilizo las clases:
  w3-row	(Container for one row of fluid responsive content)
  w3-half (The width of the w3-half class is 1/2 of the parent element (style="width:50%")).

**Fichero js** *practicad3.js*  
Consta:

  - Variables.  
  - SVG para el MAPA y el CHAR BART.  
  - Grupos para los SVG anteriores.  
  - Lectura del JSON.  
  - Lectura del CSV.  
  - Pintar el MAPA:  
    - Treshold Scale Legend con 7 divisiones comprendidas entre 0 y el máximo del precio medio de alquiler del json.  
    - Acciones al seleccionar un barrio:  
      - on click --> muestra una cabecera con la información de dicho barrio y el precio medio de alquiler (remove en cada click).  
      - on mouseover  --> se resalta el color en rojo.  
      - on mouseleave --> se reestablece el color según su precio medio.    
  - Pintar el BAR CHART:  
    - Remove de los elementos y texto del grupo asociado al SVG del BAR CHART para que en cada onclick del barrio actualice los datos. 
    - Título con el texto Bar Chart: junto con el nombre del barrio seleccionado.  
    - Escala Band (eje X) indica el Nº Habitaciones --> su dominio está comprendido entre [0, max(nºhabitaciones].  
    - Escala Linear (eje Y) indica el Nº Viviendas -->  su dominio está comprendido entre [0, max(nºviviendas].  
    - Labels con el nº de viviendas en cada unos de los rectangulos del bar chart.




