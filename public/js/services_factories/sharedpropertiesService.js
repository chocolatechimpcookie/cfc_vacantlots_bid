angular.module('vacantlotsApp').service('sharedpropertiesService', function()
  {
    var property = {};
    var properties = [];
    var center;
    var zoom;
    return {
        getProperty: function()
        {
            return property;
        },
        setProperty: function(value)
        {
            console.log('Setting string through shared object');
            console.log(value)
            property = value;
        },
        getProperties: function()
        {
          return properties;
        },
        setProperties: function(value)
        {
          properties = value;
        },
        getCenter: function(value)
        {
          return center;

        },
        setCenter: function(value)
        {
          center = value;
        },
        getZoom: function(value)
        {
          return zoom;

        },
        setZoom: function(value)
        {
          zoom = value;
        }
    }
});
