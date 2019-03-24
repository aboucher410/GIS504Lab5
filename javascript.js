window.onload = function(){
alert('If you give it permission, this web page will access to your location in order to demonstrate how device sensors can interact with web maps.');
} // On load, this alert notifies the user that the page will ask to access their location and gives a reason why. You can easily modify this text.

var map = L.map('map').fitWorld(); //Here we initialize the map in the "map" div defined in the html body. Below, we call in Mapbox tiles and use the options to set the max zoom to 18, include our attribution, specify that the tiles set we want is mapbox.streets, and provide the access token for Mapbox's API

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}' , {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="mapbox://styles/mapbox/outdoors-v9">Outdoors</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.outdoors', // experiment with changing this to mapbox.light, mapbox.dark, mapbox.satellite, etc.
  accessToken: 'pk.eyJ1IjoiYWIxMCIsImEiOiJjanN3ZXZua3cwZ3ppNDNwcjd4aGRpMGR0In0.FPuUGMHZEG23LWr-NWhfbA' //this is a generic access token, but when you deploy projects of your own, you must get a unique key that is tied to your Mapbox account
}).addTo(map);

var map_map;
var map_markers = [];
var map_polylines = [];
var map_route_waypoints = [];
var map_feature_group;

(function() {
    map_map = L.map('map', {
        center: [52.5,13.4],
        attributionControl: false
    });

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        id: 'jaygoodswp.0a28k881',
        accessToken: 'pk.eyJ1IjoiamF5Z29vZHN3cCIsImEiOiJjaW5scm92bjIweXh2dHRtM2N3Nmdja3QwIn0.tQz7VNzTgdlEuibA5swS3w'
    }).addTo(map_map);
})();

(function() {
    var routing = [];

    // [START] the following repeats 10 times (but with different waypoints)
map_route_waypoints.push([[48.427626,10.877655],[48.427626,10.877655],[48.428817,10.877530],[48.428794,10.877490],[48.428794,10.877490],[48.429427,10.876769],[48.429993,10.875997],[48.429985,10.874054],[48.429983,10.871665],[48.429978,10.869169],[48.429975,10.866704],[48.429880,10.865278],[48.428253,10.865594],[48.426140,10.866007],[48.424412,10.865985],[48.424267,10.865933],[48.424267,10.865933],[48.424010,10.865870],[48.423200,10.867021],[48.420123,10.868246],[48.417399,10.869749],[48.415272,10.868973],[48.415029,10.864935],[48.415558,10.857768],[48.416302,10.848967],[48.417230,10.838084],[48.419207,10.815853],[48.419956,10.805343],[48.417408,10.746530],[48.416791,10.726497],[48.417313,10.717214],[48.417980,10.707847],[48.418672,10.698317],[48.419447,10.689150],[48.420022,10.680101],[48.418308,10.671601],[48.414469,10.663102],[48.412280,10.653700],[48.411017,10.644776],[48.409779,10.636280],[48.410072,10.625954],[48.410185,10.614270],[48.409880,10.601512],[48.409742,10.589707],[48.407958,10.577822],[48.406187,10.568996],[48.404042,10.560529],[48.401143,10.553553],[48.399954,10.545541],[48.401261,10.536627],[48.403610,10.528194],[48.405992,10.519216],[48.408022,10.509773],[48.409374,10.499818],[48.410475,10.489759],[48.411363,10.481394],[48.412196,10.474118],[48.413007,10.466547],[48.413455,10.459332],[48.413090,10.450934],[48.412910,10.441510],[48.412711,10.431478]])
    routing.push(L.Routing.control({
        waypoints: map_route_waypoints[0],
        show: false,
        waypointMode: 'snap',
        fitSelectedRoutes: false,
        createMarker: function() {}
    }).addTo(map_map));

    routing[0].on('routeselected', function(e) {
        map_polylines.push(L.polyline(e.route.coordinates, {
            stroke: true,
            color: '#FF69B4',
            weight: 5
        }));
        map_feature_group.addLayer(map_polylines[0]);
        map_map.removeControl(routing[0]);
    });

    routing[0].on('routingerror', function(error) {
        map_polylines.push(L.polyline(map_route_waypoints[0], {
            stroke: true,
            color: '#000',
            weight: 5
        }));
        map_feature_group.addLayer(map_polylines[0]);
        map_map.removeControl(routing[0]);
    });
    // [END] the preceding repeats 10 times

    map_feature_group.addTo(map_map);
    map_map.fitBounds(map_feature_group.getBounds());
})();
//the below JS code takes advantage of the Geolocate API as it is incorporated in the Leaflet JS API with the locate method
function onLocationFound(e) { //this function does three things if the location is found: it defines a radius variable, adds a popup to the map, and adds a circle to the map.

  var radius = e.accuracy / 2; //this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.

  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " feet of this point.").openPopup();
  //this adds a Leaflet popup to the map at the lat and long returned by the locate function. The text of the popup is defined here as well. Please change this text to specify what unit the radius is reported in.

  L.circle(e.latlng, radius).addTo(map); // this adds a Leaflet circle to the map at the lat and long returned by the locate function. Its radius is set to the var radius defined above.

  if (radius < 30) {
      L.circle(e.latlng, radius, {color: 'blue'}).addTo(map);
  }
  else{
      L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
  }
  //this adds a Leaflet circle to the map at the lat and long returned by the locate function. Its radius is set to the var radius defined above. If the radius is less than 30, the color of the circle is blue. If it is more than 30, the color is red. Comment out the line of code that adds the simple circle and uncomment the seven lines of code that enable the responsively colored circle. NOTE: there are two syntax errors in the code that you must correct in order for it to function.
}

function onLocationError(e) {
  alert(e.message);
  // ab. Added:Check to see if the browser supports the GeoLocation API.
if (navigator.geolocation) {

} else {
  // Print out a message to the user.
  document.write('Your browser does not support GeoLocation');
}}
//this function runs if the location is not found when the locate method is called. It produces an alert window that reports the error

//these are event listeners that call the functions above depending on whether or not the locate method is successful
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//This specifies that the locate method should run
map.locate({
  setView: true, //this option centers the map on location and zooms
  maxZoom: 16, // this option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the location reading allows for closer zoom
  timeout: 20000, // this option specifies when the browser will stop attempting to get a fix on the device's location. Units are miliseconds. Change this to 5000 and test the change. Before you submit, change this to 15000.
  watch: false, // you can set this option from false to true to track a user's movement over time instead of just once. For our purposes, however, leave this option as is.
});
