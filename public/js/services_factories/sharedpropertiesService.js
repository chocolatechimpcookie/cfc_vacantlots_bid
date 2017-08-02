angular.module('vacantlotsApp').service('sharedpropertiesService', function()
  {
    var property = {};
    var properties = [];

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
        }
    }
});
