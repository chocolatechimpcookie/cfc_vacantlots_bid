**Pick one thing at a time to fix**
<!-- - Need to fix the bid id first since you gotta link it to bid view and service -->
- **then bid view**
- **then bid imagePath**
- when you press X on infowindow, the infowindow should disappear and so should show my property
- bid page
  - Have a custom URL so that you can return to a particular item
<!-- - if there is a way to bring the user back to where they were in on the map, position wise -->
<!-- - Is sharedpropertiesService being applied appropriately? it is being put on vm -->
- resolve?
- reject?
- Issue of page reloading, if you are on a bid or specific property, you lose your spot
- improve modal, maybe integrate a function where until click close, next state does not fire
- **Filters**
  - https://appendto.com/2016/09/advanced-google-maps-with-javascript-filtering-and-displaying-information/
-
- login, logged out restrictions
  - Capability of bidding needs to be restricted to who logged in.
  - Logging out on view X, will send you back to view Y
- Change infowindow UI
<!-- - Why are these functions outside of the controller?
    - Won't need to pass vm when its in there -->
- Why do callback functions need to be wrapped?
- Turn DOM manip on map view into jquery?
- Property view
  - How can I manipulate its position?
- Fix DOM manipulation on bidview
- Bidding calls
  - retrieve
    - existing bids on something
    - average bid
      - In bid view and on infowindow
        - When you open info window, grab it
        - then push it to a service
    - your favorites
    - starred
  - send
    - Placing bids
<!-- - bidview
  - Streetname case? -->
- Change icons for individual places

### Brainstorming/Scratch
- I want average bid on infowindow and other info
  - Will have to setup service with it
  - is the infowindow built at the time of clicking or is it setup for each at the marker?
- *Need* to fix the bid id first since you gotta link it to bid view and service
  - vm.locations?
    - What is position 3 in 1086 - 1096 McCarter in vm.locations?
    - used
      - end of retrieve
      - in pointPanoramaAndSetInfoWindow
        - *Why does this get a i? why is it multidimensional?*
        - gets it from setupPanoramaAtMarkerWrapper
          - gets it from setupMap()
          - gets it from
          - I don't think its actually used, it can just use whatever iterator is in
              markers, they share iterators spaces. the I is from markers.
    - has address, lat, long and `i`
    - i? its an iterator, not lotID, what does this iterator do?
      - the i is the place in properties exists, so it probably exists in the same place as vm.locations
  - what should be pushed to sharedpropertiesService?
    - depends on what gets saved when you return to maps
    - definitely locations
    - Do I need markers? What's the difference?
    - Do I need property? Considering I can just access the properties?
    - What is it doing?
      - check in beginning
      - vm.markers -> setProperties
      - pointPanoramaAndSetInfoWindow -> setProperty of locations[]
  - vm.markers
    - *sharedpropertiesService uses it on setProperties, why tho; why not locations*
    - Looks like it may just be what is sent to GoogleMaps and processed
    - contains two googlemarker object each
  - How does clicking the marker address the appropriate address for bid?
    - In setupMap, a listener is added to every marker and points to setupPanoramaAtMarkerWrapper with marker i
  - How are the markers setup?
  <!-- - Where is the original response array? -->
  - propertyLatLng?
  - What relevant data do I need for posting bids?
    - lotID
  - Is there a more efficient way to organize the markers?
  - What's the difference between regular processProperties and my own?
    - tmpmarkers is kind of unnecessary and copying takes more processing
- What other property information comes out of that initial pull and why is the data here so limited?
  - Where is the property id, etc
  - why is the iterator being pushed?
  <!-- - Why are there two sets of the markers pushed to VM?
    - vm.locations
    - vm.markers -->
  - What is lotID and how does it differ from `_id`?
  - need the other icons
  - Where is the average bid?
  - Where is the bid calls?
  - So some properties don't have an available street view, and this needs to be handled
  - One is for information for info window, one is for the markers





### Cina's existing
  - test1



### Bugs
  - click 194 newton, bug
    - Uncaught TypeError: Cannot read property 'addEventListener' of null
    - MapCtrl.js:177 Uncaught TypeError: Cannot read property '0' of undefined
  - Cannot read property '0' of undefined
    - Happens when clicking random markers
    - Uncaught TypeError: Cannot read property '0' of undefined
      at Wf.pointPanoramaAndSetInfoWindow (MapCtrl.js:182)
      at Wf.<anonymous> (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:102)
      at Object._.A.trigger (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:101)
      at Ib (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:38)
      at Ib (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:38)
      at Ib (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:38)
      at o3._.k.set (js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:103)
      at streetview.js:96
      at js?key=AIzaSyB_vAujLUGyZ7Rt5S3Ah36-jmliZ69uRGM:35
  - angular1_6_1.min.js:122 Error: Could not resolve 'myBids' from state '
