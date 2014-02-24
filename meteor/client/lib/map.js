if (Meteor.isClient) {

  $( window ).resize(function() {
    // resize map
    var height = window.innerHeight;
    var width = window.innerWidth;
    document.getElementById('map').style.height = height+"px";
    document.getElementById('map').style.width = width+"px";

    // put the form div in the center
    document.getElementById("form").style.left = ((width - 460)/2) + "px";
    document.getElementById("data-store").style.left = ((width - 400)/2) + "px";
  });

  setBounds = function(e){
    Session.set("south", window.map.getBounds().getSouth());
    Session.set("north", window.map.getBounds().getNorth());
    Session.set("west", window.map.getBounds().getWest());
    Session.set("east", window.map.getBounds().getEast());
  };

  initializeMap = function(){
    var map = L.map('map').setView([38.73367, -9.1359], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/77a34cfef5b04463919a252c0a36bdbb/997/256/{z}/{x}/{y}.png', {
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
