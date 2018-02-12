var map;
var startLocation = {lat: 48.368265, lng: 14.513698}; //default is hgbg



function initMap(userInput) {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    //userLocation();
    // map options
    var options = {
        zoom: 8,
        center: startLocation
    };

    // new map
    map = new google.maps.Map(document.getElementById('map'), options);

    // user distance input
    var userDistance = userInput;

    calcRoute(directionsService, directionsDisplay, userDistance);
    directionsDisplay.setMap(map);
}

function calcRoute(directionsService, directionsDisplay, distance) {
    var targ = setTargetLocation(startLocation, distance);
    var request = {
        origin: startLocation,
        destination: targ,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status){
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
        }
    })
     directionsDisplay.setMap(map);
}

function userLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(storePosition);
    } else {
        loc.innerHTML = "Location tracking not possible #yolo.";
    }
}

function setTargetLocation(start, distance){

    var startPoint = new google.maps.LatLng(start.lat, start.lng);
    var heading = 100;
    var endPoint = google.maps.geometry.spherical.computeOffset(startPoint, distance * 1000, heading);


    // return the name
    var startName = returnCityName(startPoint);
    console.log("Start point is:" + startName);
    console.log("End point is:" + returnCityName(endPoint));

      var dest = {
          lat: endPoint.lat(),  //endPoint.latitude,
          lng: endPoint.lng()  //endPoint.longitude
      }

    return dest;
}

function storePosition(position){
    startLocation.lat = position.coords.latitude;
    startLocation.lng = position.coords.longitude;
    // center map
    //map.setCenter(startLocation);
}

function returnCityName(location){
    var cityName = "";
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'location': location}, function(results, status) {
        if (status == 'OK') {
            // console.log(results[0].formatted_address);
            // var cityName += results[0].formatted_address;
            console.log(cityName);
            $("#result-headline").text(cityName);

            // cityName =  JSON.stringify(results[0].formatted_address);
            // cityName = jQuery(results[0].formatted_address).text();
            // cityName = results[0].formatted_address;
            if($("#result-headline").text == "")
                $("#result-headline").text = "Distance between the points on the map";
        } else {
            console.log('1. Geocode was not successful for the following reason: ' + status);
        }
    });

    return cityName;
}
