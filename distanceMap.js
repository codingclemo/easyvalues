var map;
var startLocation = {lat: 48.2205994, lng: 16.2396333}; //default is vienna

function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    // userLocation();
    // map options
    var options = {
        zoom: 8,
        center: startLocation
    };

    // new map
    map = new google.maps.Map(document.getElementById('map'), options);
    
    calcRoute(directionsService, directionsDisplay, 2000);
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
    // var newLat = ((distance * 0.8) / 110.574);
    // var newLng = start.lng;
    // var dest = {
    //     lat: newLat,
    //     lng: newLng
    // }
    var startPoint = new google.maps.LatLng(start.lat, start.lng);
    // var endPoint = new google.maps.LatLng(start.lat, start.lng);
    var heading = 270;
    var endPoint = google.maps.geometry.spherical.computeOffset(startPoint, distance * 1000, heading);

    // var growingDistance = google.maps.geometry.spherical.computeDistanceBetween(startPoint, endPoint);
    // console.log("Distance in meters: " + growingDistance);

    var geocoder = new google.maps.Geocoder();
    var isCity = true;

    while (isCity || heading > 14) {
        endPoint = google.maps.geometry.spherical.computeOffset(startPoint, distance * 1000, heading);
        geocoder.geocode( { 'location': endPoint}, function(results, status) {
            if (status == 'OK') {
                isCity = true;
              console.log("First try: " + results[0].formatted_address);
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
                // alert('Geocode was not successful for the following reason: ' + status);
                heading -= 15;
                isCity = false;
            }
          });
    }


    //   while (status != 'OK' || heading > 14) {
    //     heading -= 15;
    //     endPoint = google.maps.geometry.spherical.computeOffset(startPoint, distance * 1000, heading);
    // }

    //   if (heading > 0) {
    //     heading -= 15;       
    //     endPoint = google.maps.geometry.spherical.computeOffset(startPoint, distance * 1000, heading);


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
    map.setCenter(startLocation);
    console.log("never shown.");
    // add marker
    // var marker = new google.maps.Marker({
    //     position: startLocation,
    //     map: map
    // })
}