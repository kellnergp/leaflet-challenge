// define api url
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// make api call
d3.json(url).then(function(data) {
    console.log(data);

    // run marker creation function with the retrieved data
    createMarkers(data);
});

// define marker creation function
function createMarkers(response) {
    // pull out features
    var features = response.features;

    // establish empty list for earthquake markers
    var quakeMarkers = [];

    // iterate through each earthquake feature to generate a marker for it
    for (let i=0; i<features.length; i++) {
        // extract a series of relevant values for the earthquake as variables
        var quakeID = features[i].id;
        var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
        var depth = features[i].geometry.coordinates[2];
        var place = features[i].properties.place;
        var time = Date(features[i].properties.time);
        var mag = features[i].properties.mag;

        // establish empty variable for fillColor
        var fillColor;

        // assign fill color by magnitude
        if (depth < 10) {fillColor = "#9FFF33";}
        else if (depth >= 10 && depth < 30) {fillColor = "#CEFF33"}
        else if (depth >= 30 && depth < 50) {fillColor = "#FFE333"}
        else if (depth >= 50 && depth < 70) {fillColor = "#FFAC33"}
        else if (depth >= 70 && depth < 90) {fillColor = "#FF7A33"}
        else {fillColor = "#FF3333"}

        // define marker radius based off magnitude
        radius = mag * 2.5;

        // define marker style options
        var geojsonMarkerOptions = {
            radius: radius,
            fillColor: fillColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // set up marker for this feature with popup containing details
        marker = L.circleMarker(location, geojsonMarkerOptions).bindPopup(
            `<h3>ID: ${quakeID}</h3>
            <h4>${place}</h4>
            <hr>
            <p>${time}</p>
            <hr>
            <p>Coordinates: ${location}</p>
            <p>Depth: ${depth}</p>
            <p>Magnitude: ${mag}</p>`
        );
        // push marker to marker list
        quakeMarkers.push(marker);
    }

    // create a layergroup from the quakeMarkers and pass it to the map gen function
    var earthquakes = L.layerGroup(quakeMarkers);

    // also pass in json data to be able to access map coordinates
    quakeMapGen(response, earthquakes);
}

// define map generation function
function quakeMapGen(data, earthquakes) {
    // pull map coordinates from geojson data and determine center of map
    var bBox = data.bbox;
    var centerLng = (bBox[0] + bBox[3]) / 2;
    var centerLat = (bBox[1] + bBox[4]) / 2;
    var center = [centerLat, centerLng];
    console.log(center);

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: center,
      zoom: 3,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // define list of magnitude colors for use in legend
    colorList = ["#9FFF33", "#CEFF33", "#FFE333", "#FFAC33", "#FF7A33", "#FF3333"];
  
    // add legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        // define the legend elements
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Depth</strong>'];
        categories = ['-10 to 10','10 to 30','30 to 50','50 to 70','70 to 90', '90+'];
        //iterate through categories and colors to create legend entries
        for (var i = 0; i < categories.length; i++) {

                div.innerHTML += 
                labels.push(
                    '<i class="circle" style="background:' + `${colorList[i]}` + '"></i> ' +
                (categories[i] ? categories[i] : '+'));

            }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
  
}