angular.module('vacantlotsApp').service('sharedpropertiesService', function()
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
