# leaflet-challenge

The US Geological Survey tracks information on all Earthquakes within the United States and makes the data available to the public.

This projects uses HTML, Javascript, and the Leaflet Javascript library to generate an interactive map of the United States which uses marker color and size to 
indicate depth and magnitude of all Earthquakes within the past seven days.

The project includes one HTML page, one Javascript file, and a CSS style script to create the map.

## HTML Template Page

Raw Link: https://github.com/kellnergp/leaflet-challenge/blob/main/Leaflet-Step-1/index.html

The `<head>` tag contains the page title and viewport specifications.

It also has a link to the Leaflet style page and the local CSS style script.

The `<body>` section includes a location for the map to be generated as well as Javascript script links.

The map is located at a `<div>` tag with an id attribute of "map".

The script links include: a link to the d3 library, a link to the Leaflet library, and a link to the local javascript file, `logic.js`.
