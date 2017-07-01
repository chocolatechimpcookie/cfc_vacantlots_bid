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

var map;
var panorama;

function processSVData(data, status) {
        if (status === 'OK') {

          panorama.setPano(data.location.pano);
        } else {
          console.error('Street View data not found for this location.');
        }
      }

angular.module('vacantlotsApp').controller('MapCtrl', ['$state', '$http', 'sharedpropertiesService', 'NgMap', function($state, $http, sharedpropertiesService, NgMap)
{
    var vm = this;

    vm.markers= [];

    var center = new google.maps.LatLng(40.7356357, -74.18 );

    var sv = new google.maps.StreetViewService();

    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview'));

    sv.getPanorama({location: center, radius: 50}, processSVData);

    var infowindow = new google.maps.InfoWindow();
    document.getElementById('streetview').style.display = 'none';


    $http.get('/map').then(function success(res)
    {
      console.log("result");
      console.log(res);
      var properties = res.data;
      var address="";
      var tmpmarkers = [];
      var locations = [];
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

          locations.push([address, property.latitude, property.longitude, i])
          google.maps.event.addListener(propertyMarker, 'click', (function(propertyMarker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, propertyMarker);
                document.getElementById('streetview').style.display = '';
                console.log(propertyMarker.getPosition())
                var markerPosition = propertyMarker.getPosition()
                sv.getPanorama({location: markerPosition, radius: 50}, processSVData);

                //You simultaneously set the streetView location and also get it's new
                //location. So you need to add a listener that will execute the
                //getLocation request after you have set the location.
                google.maps.event.addListenerOnce(panorama, 'status_changed', function () {
                  var heading = google.maps.geometry.spherical.computeHeading(panorama.getLocation().latLng,
                                                                              markerPosition);
                  panorama.setPov({
                      heading: heading,
                      pitch: 0
                  });
                  panorama.setVisible(true);
                  setTimeout(function() {
                  marker = new google.maps.Marker({
                      position: markerPosition,
                      map: panorama,
                  });
                  if (marker && marker.setMap) marker.setMap(panorama);}, 500);
              });
            }
      })(propertyMarker, i));

      }
      vm.markers = tmpmarkers;
      // console.log("these are the markers");
      console.log(vm.markers);

      var markerCluster = new MarkerClusterer(map,
                       vm.markers, {imagePath: 'https://googlemaps.github.io/js-marker-clusterer/images/m'});

      // So here, we either push the markers directly into vm.markers or we
      // create a temp array and then then make markers equivelent to it

    }, function err(res)
    {
        console.log(res);
    });


}]);


// var createMarker = function(i, address, latitude, longitude, idKey)
// {
//   // if (idKey == null)
//   // {
//   //   idKey = "id";
//   // }
//   var ret =
//
//   // ret[idKey] = i;
//   return ret;
// };


// console.log(vm.map.center);
//
// if (localStorage.getItem("token"))
// {
//     console.log("Login token is present");
//     console.log(localStorage.getItem("token"));
// }
//
// // uiGmapGoogleMapApi is a promise.
// // The "then" callback function provides the google.maps object.
// uiGmapGoogleMapApi.then(function(maps)
// {
// });
//
// //Creates object containing info needed to create Google maps marker

//
// var markers = [];
// var properties;
// // HTTP get to load property data from JSON file.

//
// vm.goBid = function (marker, event, model)
// {
//    sharedpropertiesService.setString(model.title)
//    $state.go('bidPage')
// };
