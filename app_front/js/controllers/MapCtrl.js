var app
app = angular.module('vacantlotsApp');

app.config(function(uiGmapGoogleMapApiProvider) {
    console.log('In config')
    uiGmapGoogleMapApiProvider.configure({
        //TODO: Factor this into another js file that isn't tracked with git?
        key: "AIzaSyA5sCewJikG42pgRQOIJ_NjnVv3c6O_d6I",
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

app.controller('MapCtrl', function($scope, uiGmapGoogleMapApi, $state, sharedProperties, $http) {
    console.log('In controller')
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    // e.g. $scope.markers = []

    $scope.map = {
              center: {
                latitude: 40.1451,
                longitude: -99.6680
              },
              zoom: 4,
              bounds: {
                northeast: {
                  latitude: 45.1451,
                  longitude: -80.6680
                },
                southwest: {
                  latitude: 30.000,
                  longitude: -120.6680
                }
              }
            };

    //$scope.map = { center: { latitude: 40.7356357, longitude: -74.18 }, zoom: 13 };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {
    });

    var createMarker = function(i, address, latitude, longitude, idKey) {
      if (idKey == null) {
        idKey = "id";
      }
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: address,
        icon: 'https://cdn1.iconfinder.com/data/icons/freeline/32/home_house_real_estate-32.png'
        //id: i
      };
      ret[idKey] = i;
      return ret;
    };

    var createRandomMarker = function(i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: '#' + i,
        icon: 'https://cdn1.iconfinder.com/data/icons/freeline/32/home_house_real_estate-32.png'
      };
      ret[idKey] = i;
      return ret;
    };

    var markers = [];

    $http.get('myprop.json')
       .then(function(res){
            // FIXME: It seems like we shouldn't need to define this again
            $scope.map = {
              center: {
                latitude: 40.1451,
                longitude: -99.6680
              },
              zoom: 4,
              bounds: {
                northeast: {
                  latitude: 45.1451,
                  longitude: -80.6680
                },
                southwest: {
                  latitude: 30.000,
                  longitude: -120.6680
                }
              }
            };

            properties = res.data;
            var numProperties = properties.length;
            for (var i = 0; i < 5; i++) {
               propertyI = properties[i]
               latitude = propertyI['Latitude']
               longitude = propertyI['Longitude']
               street = propertyI['Vital Street Name']
               houseNumber = propertyI['Vital House Number']
               address = street + houseNumber
               console.log(i + address)
               marker = createMarker(i, address, latitude, longitude)
               console.log(marker)
               markers.push(marker)
            }
            $scope.randomMarkers = markers;

            $scope.markerOptions = {draggable: true};
       });

    $scope.goBid = function (marker, event, model){
        sharedProperties.setString(model.title)
        $state.go('bidPage')
    };

});
