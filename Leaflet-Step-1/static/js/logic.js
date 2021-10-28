// define api url
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// define variables
/* var bBox;
var features;
var geometry;
var ids;
var properties; */

// make api call
d3.json(url).then(function(data) {
    //console.log(data);

    // store values from data
    //bBox = data.bbox;
    //features = data.features;

    //console.log(bBox);
    //console.log(features);

    createMarkers(data);
});

function createMarkers(response) {
    // pull out features
    var features = response.features;

    // establish empty list for earthquake markers
    var quakeMarkers = [];

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

        // pick fill color by magnitude
        if (depth < 10) {fillColor = "9FFF33";}
        else if (depth >= 10 && depth < 30) {fillColor = "CEFF33"}
        else if (depth >= 30 && depth < 50) {fillColor = "FFE333"}
        else if (depth >= 50 && depth < 70) {fillColor = "FFAC33"}
        else if (depth >= 70 && depth < 90) {fillColor = "FF7A33"}
        else {fillColor = "FF3333"}

        // define marker style options
        var geojsonMarkerOptions = {
            radius: mag,
            fillColor: fillColor,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        // set up marker for this feature
        marker = L.circleMarker(location, geojsonMarkerOptions).bindPopup(
            `<h3>ID: ${quakeID}</h3>
            <h4>${place}</h4>
            <hr>
            <p>${time}</p>`
        );
        // push marker to marker list
        quakeMarkers.push(marker);
    }

    // create a layergroup from the quakeMarkers and pass it to the map gen function
    var earthquakes = L.layergroup(quakeMarkers);

    quakeMapGen(earthquakes);
}