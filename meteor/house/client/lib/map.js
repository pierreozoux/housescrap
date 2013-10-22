if (Meteor.isClient) {
  initializeMap = function(){
    divmap = document.getElementById('map');
    var height = $(document).height() - 34;
    divmap.style.height = height+"px";

    var map = L.map('map').setView([38.73367, -9.1359], 13);

    L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }).addTo(map);
    return map;
  };
}
