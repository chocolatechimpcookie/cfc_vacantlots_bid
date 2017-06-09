angular.module('vacantlotsApp').config(function(uiGmapGoogleMapApiProvider)
{
    console.log('In config');
    uiGmapGoogleMapApiProvider.configure(
    {
        //TODO: Factor this into another js file that isn't tracked with git?
        key: "AIzaSyA5sCewJikG42pgRQOIJ_NjnVv3c6O_d6I",
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});


//this needs to be changed, perhaps in a seperate files with a more descriptive name

angular.module('vacantlotsApp').service('sharedProperties', function()
{
  var objectValue = {
  data: 'not found'
};

  return {
      getString: function()
      {
          return objectValue.data;
      },
      setString: function(value)
      {
          console.log('Setting string through shared object');
          objectValue.data = value;
      },
      getObject: function()
      {
          return objectValue;
      }
  }
});



angular.module('vacantlotsApp').controller('MapCtrl', ['uiGmapGoogleMapApi', '$state', '$http', 'sharedProperties', function(uiGmapGoogleMapApi, $state, $http, sharedProperties)
{
  // Do stuff with your $scope.
  // Note: Some of the directives require at least something to be defined originally!
  // e.g. $scope.markers = []
    var vm = this;
    vm.map = { center: { latitude: 40.7356357, longitude: -74.18 }, zoom: 13 };

    if (localStorage.getItem("token"))
    {
        console.log("Login token is present");
        console.log(localStorage.getItem("token"));
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps)
    {
    });

    //Creates object containing info needed to create Google maps marker
    var createMarker = function(i, address, latitude, longitude, idKey)
    {
      if (idKey == null)
      {
        idKey = "id";
      }
      var ret =
      {
        latitude: latitude,
        longitude: longitude,
        title: address,
        icon: '../../images/mapicons/iconblue.png'
        // icon: ''
        //id: i
      };
      ret[idKey] = i;
      return ret;
    };

    var markers = [];
    var properties;
    // HTTP get to load property data from JSON file.
    $http.get('/map').then(function success(res)
    {
        properties = res.data;
        //TODO: Need some way to filter properties. There are too many to look at at once.
        var numProperties = properties.length;
        for (var i = 0; i < numProperties; i++)
        {
            property = properties[i];
            houseNumber = property.vitalHouseNumber;
            street = property.vitalStreetName;
            address = houseNumber + ' ' + street;
            latitude = property.latitude;
            longitude = property.longitude;
            //console.log(i, address, latitude, longitude);
            markers.push(createMarker(i, address, latitude, longitude));
        }
        vm.markers = markers;
    }, function err(res)
    {
        console.log(res);
    });

    vm.goBid = function (marker, event, model)
    {
       sharedProperties.setString(model.title)
       $state.go('bidPage')
    };
}]);
