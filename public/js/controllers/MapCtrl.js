// angular.module('vacantlotsApp').config(function(uiGmapGoogleMapApiProvider)
// {
//     console.log('In config');
//     uiGmapGoogleMapApiProvider.configure(
//     {
//         //TODO: Factor this into another js file that isn't tracked with git?
//         key: "AIzaSyA5sCewJikG42pgRQOIJ_NjnVv3c6O_d6I",
//         v: '3.20', //defaults to latest 3.X anyhow
//         libraries: 'weather,geometry,visualization'
//     });
// });


//this needs to be changed, perhaps in a seperate files with a more descriptive name

/**
 * Processes streetview data from google streetview service. It saves the date of the
 * panorama in the panoramaDate global variable, and it sets the location of the global panorama.
 */
angular.module('vacantlotsApp').controller('MapCtrl', ['$state', '$http', 'sharedpropertiesService', 'NgMap', function($state, $http, sharedpropertiesService, NgMap)
{
  var vm = this;

  vm.processSVData = function processSVData(data, status) {
    if (status === 'OK') {
      vm.panoramaDate = data.imageDate
      vm.panorama.setPano(data.location.pano);
    } else {
      console.error('Street View data not found for this location.');
    }
  }

  vm.markers= [];
  vm.locations = [];

  vm.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview'));
  var sv = new google.maps.StreetViewService();

  var infowindow = new google.maps.InfoWindow();

  document.getElementById('streetview').style.display = 'none';

  var getProperties = sharedpropertiesService.getProperties();
  if (getProperties.length > 1)
  {
    vm.markers = getProperties;
  }
  else
  {
    propertyservercall();
  }

  function propertyservercall()
  {
    $http.get('/map').then(function success(res)
    {
      console.log("result");
      console.log(res);
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

        // So here, we either push the markers directly into vm.markers or we
        // create a temp array and then then make markers equivelent to it

      }, function err(res)
    {
      console.log(res);
    });
  }


  //Getting the map is asynchronous. You don't get the map until the callback function is executed.
  // So we have to wait for the map in order to set the property markers
  NgMap.getMap().then(function(map)
  {
  vm.map = map;
  vm.center = map.getCenter();
  sv.getPanorama({location: vm.center, radius: 50}, vm.processSVData);

  for (var i = 0; i < vm.markers.length; i++)
  {
    var propertyMarker = vm.markers[i]
    google.maps.event.addListener(propertyMarker, 'click', (function(propertyMarker, i) {
      return function() {
        var markerPosition = propertyMarker.getPosition()
        sv.getPanorama({location: markerPosition, radius: 50}, vm.processSVData);

        //You simultaneously set the streetView location and also get it's new
        //location. So you need to add a listener that will execute the
        //getLocation request after you have set the location. This is also important
        // for the panoramaDate variable.
        google.maps.event.addListenerOnce(vm.panorama, 'status_changed', function () {
          addressAndDate = '<div> Address: '+vm.locations[i][0]+'</div><div>Image date: ' + vm.panoramaDate+'</div>'
          infowindow.setContent(addressAndDate);
          infowindow.open(vm.map, propertyMarker);
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
        });
      }
    })(propertyMarker, i));
  }

  var markerCluster = new MarkerClusterer(vm.map,
             vm.markers, {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'});

});

}]);
