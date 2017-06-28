angular.module('vacantlotsApp').service('sharedpropertiesService', function()
  {
    var property = {};

  return {
      getProperty: function()
      {
          return property;
      },
      setProperty: function(value)
      {
          console.log('Setting string through shared object');
          property = value;
      }
      // getObject: function()
      // {
      //     return objectValue;
      // }
  }
});
