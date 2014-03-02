if (Meteor.isClient) {
  setBounds = function(){
    Session.set("south", window.map.getBounds().getSouth());
    Session.set("north", window.map.getBounds().getNorth());
    Session.set("west", window.map.getBounds().getWest());
    Session.set("east", window.map.getBounds().getEast());
  };

  initializeMap = function(){
    var map = L.map('map').setView([38.73367, -9.1359], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/77a34cfef5b04463919a252c0a36bdbb/123080/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);

    map.on('popupopen', function(e) {
      var marker = e.popup._source;
      marker.house.slideshow(0);
      hideForm();
    });

    return map;
  };

}
