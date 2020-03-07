## Fichero csv con los barrios de Madrid 

Por cada barrio se obtiene el total de viviendas agrupadas por el nº de habitaciones

Si el fichero se carga desde github, se producía el siguiente ERROR 

Access to fetch at 'https://github.com/olgaalvaro/Modern-exploration-visualization-d3js/blob/master/DATA/airbnbmadrid_counthousesbybedrooms.csv' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
d3.v5.min.js:2 GET https://github.com/olgaalvaro/Modern-exploration-visualization-d3js/blob/master/DATA/airbnbmadrid_counthousesbybedrooms.csv net::ERR_FAILED

Instele el plugin  Instalar Allow CORS: Access-Control-Allow-Origin pero al final opte por guardarlo en https://gist.githubusercontent.com/olgaalvaro  (tal y como se hace con el json) 

https://gist.githubusercontent.com/olgaalvaro/915a0740f47d75e40f9fc3ef28943ec1/raw/59ad38733b6dd93058e1ed68c3db5a4c107d6595/airbnbmadrid_counthousesbybedrooms
