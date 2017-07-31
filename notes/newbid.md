### Things to do
- login, logged out restrictions
  - Capability of bidding needs to be restricted to who logged in.
  - Logging out on view X, will send you back to view Y
- Change infowindow UI
- Why are these functions outside of the controller?
    - Won't need to pass vm when its in there
- Turn DOM manip on map view into jquery?
- Fix DOM manipulation on bidview
- Bidding calls
  - retrieve
    - existing bids on something
    - average bid
      - In bid viev and on infowindow
        - When you open info window, grab it
        - then push it to a service
    - your favorites
    - starred
  - send
    - Placing bids
- bidview
  - Streetname case?
- Change icons for individual places 


Brainstorming/Scratch
- What other property information comes out of that initial pull and why is the data here so limited?
  - Where is the property id, etc
  - why is the iterator being pushed?
  - Why are there two sets of the markers pushed to VM?
    - vm.locations
    - vm.markers
  - What is lotID and how does it differ from `_id`?
  - `_id` and other properties need to be in the sharedpropertiesService
  - need the other icons

  - So some properties don't have an available street view, and this needs to be handled
  - One is for information for info window, one is for the markers


Cina's existing
  - test1



Bugs
  - click 194 newton, bug
    - Uncaught TypeError: Cannot read property 'addEventListener' of null
    - MapCtrl.js:177 Uncaught TypeError: Cannot read property '0' of undefined
