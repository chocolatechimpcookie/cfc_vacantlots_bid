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




angular.module('vacantlotsApp').controller('MapCtrl', ['$state', '$http', 'sharedpropertiesService', 'NgMap', function($state, $http, sharedpropertiesService, NgMap)
{
    var vm = this;






    vm.initMap = function(mapId)
    {
       vm.map = NgMap.initMap(mapId);
       console.log('vm.map 2', vm.map)
     }

    vm.genmap =
    {
        center:[40.7356357, -74.18 ]
    };

    vm.markers= [];

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


    // vm.createInfoWindow = function(arg1, arg2)
    // {
    //   console.log(arg1);
    //   console.log(arg2);
    // }

    vm.showStore = function(evt, storeId)
    {
      console.log(evt, storeId);
      // vm.store = vm.stores[storeId];
      // vm.map.showInfoWindow(vm.store.infoWindow, this);
    };

    $http.get('/map').then(function success(res)
    {
      console.log("result");
      console.log(res);
      var properties = res.data;
      var address="";
      var tmpmarkers = [];
      var propertyname = "";
      var propnamet;
      console.log(properties[700]);

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

          // tmpmarkers.push(
          vm.markers.push(
          {
            latitude: property.latitude,
            longitude: property.longitude,
            address: address,
            // icon: '../../images/mapicons/iconred.png',
            id: property._id
          });

      }
      // vm.markers = tmpmarkers;
      console.log("these are the markers");
      console.log(vm.markers);

      // vm.markers = markers;
    }, function err(res)
    {
        console.log(res);
    });


}]);



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
