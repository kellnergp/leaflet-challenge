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
    var features = response.features;

    var quakeMarkers = [];

    for (let i=0; i<features.length; i++) {
        // extract a series of relevant values for the earthquake as variables
        var location = [features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]];
        var depth = features[i].geometry.coordinates[2];
        var place = features[i].properties.place;
        var time = Date(features[i].properties.time);
        var mag = features[i].properties.mag;

        // establish empty variable for fillColor
        var fillColor;

        // pick fill color by magnitude
        if (mag < 10) {fillColor = "9FFF33";}
        else if (mag >= 10 && mag < 30) {fillColor = "CEFF33"}
        else if (mag >= 30 && mag < 50) {fillColor = "FFE333"}
    }
}