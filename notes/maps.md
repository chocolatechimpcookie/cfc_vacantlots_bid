## Brain storming
  - Larger infowindow or something larger
  - Maybe get rid of bidview and integrate bid functionality?
  - If not getting rid of bidview
    - Does the array get erased everytime switching?
    - Maybe store the array
      - if stored doesn't exist -> don't call server
    - At some point tho server calls still need to happen
  - Less reloading of the map?
    - Put markers array into service
    - Have an API call which can check when the server has been last updated or if any
      existing arrays have been saved 





##  Ngmaps
  - Any bugs down the line will leave us dependent on the framework developers
    - We could always fork it though or contribute
  - Faster development

##  From scratch
  - Slower development
  - Not dependent on any other developers
  - Learn how the Googlemaps API works
  - Might be faster


##  Weird bug
  - It has something to do with calling the controller "map"
  - it was not the surrounding wrapper
  -

## Other Ngmap stuff
  - Ngmap forces 300px height blocks on map and has to be overridden. very weird


##  Links
  - https://ngmap.github.io
  - https://github.com/allenhwkim/angularjs-google-maps
