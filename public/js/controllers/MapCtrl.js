/**
 * Processes streetview data from google streetview service. It saves the date of the
 * panorama in the panoramaDate global variable, and it sets the location of the global panorama.
 */



angular.module('vacantlotsApp').controller('MapCtrl', ['$state', '$http', 'sharedpropertiesService', 'NgMap', function($state, $http, sharedpropertiesService, NgMap)
{
  var vm = this;

  vm.markers= [];
  vm.locations = [];

  vm.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview'));
  document.getElementById('streetview').style.display = 'none';
  vm.sv = new google.maps.StreetViewService();

  vm.infowindow = new google.maps.InfoWindow()

  //TODO: Make this less nested
  var propertiesLoadedToVM = new Promise(function(resolve, reject) {
    var getProperties = sharedpropertiesService.getProperties();
    if (getProperties.length > 1){
      vm.markers = getProperties;
      resolve()
    }
    else{
      $http.get('/map').then(function success(res)
      {
        Timeout(processProperties(res)
        resolve()
      }, function err(res)
      {
        console.log(res);
        reject()
      });
    }
  });

  function processProperties(res){
    var properties = res.data;
    var address="";
    var tmpmarkers = [];
    var propertyname = "";
    var propnamet;
    console.log(properties[0]);

    for (var i = 0; i < properties.length; i++)
    {
      property = properties[i];
      propnamet= "";
      propertyname ="";
      propnamet = property.vitalStreetName.trim();
      propnamet = propnamet.split(" ");
      for (var x = 0; x < propnamet.length; x++)
      {
        propertyname +=" " + propnamet[x][0] +  propnamet[x].slice(1).toLowerCase();
      }
      address =
      property.vitalHouseNumber
      + propertyname;
      ;

      address =
      property.vitalHouseNumber
      + property.vitalStreetName;
      ;

      var propertyLatLng = new google.maps.LatLng(property.latitude,
      property.longitude);
      var propertyMarker = new google.maps.Marker({
        position: propertyLatLng
      });
      tmpmarkers.push(propertyMarker)

      vm.locations.push([address, property.latitude, property.longitude, i])
    }
    vm.markers = tmpmarkers;
    // console.log("these are the markers");
    console.log(vm.markers);
    sharedpropertiesService.setProperties(vm.markers);
  }

  //Getting the map is asynchronous. You don't get the map until the callback function is executed.
  // So we have to wait for the map in order to set the property markers
  mapLoadedToVM = new Promise(function(resolve, reject){
    NgMap.getMap().then(function(map){
     vm.map = map
     resolve()
    })
  });

  Promise.all([propertiesLoadedToVM, mapLoadedToVM]).then(setupMap);

  function setupMap()
  {
    console.log('T4 '+performance.now())
    vm.center = vm.map.getCenter();
    vm.sv.getPanorama({location: vm.center, radius: 50}, vm.processSVData);

    for (var i = 0; i < vm.markers.length; i++)
    {
      var propertyMarker = vm.markers[i]
      google.maps.event.addListener(propertyMarker, 'click',
                                    setupPanoramaAtMarkerWrapper(vm, propertyMarker, i));
    }

    var markerCluster = new MarkerClusterer(vm.map,
             vm.markers, {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'});
  }

  vm.processSVData = function(data, status) {
    if (status === 'OK') {
      vm.panoramaDate = data.imageDate
      vm.panorama.setPano(data.location.pano);
      console.log('T8 '+performance.now())
    } else {
      console.error('Street View data not found for this location.');
    }
  }
  console.log('T9 '+performance.now())
}]);

function setupPanoramaAtMarkerWrapper(vm, propertyMarker, i){
 function setupPanoramaAtMarker() {
   console.log('T6 '+performance.now())
   var markerPosition = propertyMarker.getPosition()
   vm.sv.getPanorama({location: markerPosition, radius: 50}, vm.processSVData);

   //You simultaneously set the streetView location and also get it's new
   //location. So you need to add a listener that will execute the
   //getLocation request after you have set the location. This is also important
   // for the panoramaDate variable.
   google.maps.event.addListenerOnce(vm.panorama, 'status_changed',
                                     pointPanoramaAndSetInfoWindowWrapper(vm, markerPosition, propertyMarker, i));
 }
 return setupPanoramaAtMarker;
}

function pointPanoramaAndSetInfoWindowWrapper(vm, markerPosition, propertyMarker, i){
  function pointPanoramaAndSetInfoWindow() {
    console.log('T7 '+performance.now())
    addressAndDate = '<div> Address: '+vm.locations[i][0]+'</div><div>Image date: ' + vm.panoramaDate+'</div>'
    vm.infowindow.setContent(addressAndDate);
    vm.infowindow.open(vm.map, propertyMarker);
    document.getElementById('streetview').style.display = '';

    var heading = google.maps.geometry.spherical.computeHeading(vm.panorama.getLocation().latLng,
                                                                    markerPosition);
    vm.panorama.setPov({
      heading: heading,
      pitch: 0
    });
    vm.panorama.setVisible(true);
    setTimeout(function() {
    marker = new google.maps.Marker({
      position: markerPosition,
      map: vm.panorama,
    });
    if (marker && marker.setMap) marker.setMap(vm.panorama);}, 500);
  }

  return pointPanoramaAndSetInfoWindow
}