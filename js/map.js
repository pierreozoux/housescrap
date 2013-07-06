var map;

var priceH = 500;
var priceL = 300;

function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

function color(price, priceH, priceL){
  var priceRange = priceH - priceL;
  var amp = price - priceL;
  var percentage = amp/priceRange;
  var blue = 0;
  var red;
  var green;
  if (percentage < 0.50) {
    green = 255;
    red = Math.round(percentage*2*255);
  } else {
    red = 255;
    green = Math.round(255 - (percentage - 0.50)*2*255);
  }
  return rgbToHex(red, green, blue);
};

function currentHouse(house){
  var contentImage = "";

  var images = house.image_urls.split(',');

  for (var i in images){
    contentImage += '<a href="'
    contentImage += images[i]
    contentImage += '" rel="lightbox[test]" title="my caption"><img src="'
    contentImage += images[i]
    contentImage += '" height="60" width="80"></a>'
  };


  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">'+
  '<a href="'+
  house.link+
  '" target="_blank">'+
  house.address+
  '</a>'+
  '</h1>'+
  '<div id="bodyContent">'+
  '<a class="pure-button pure-button-red pure-button-xsmall" onclick="not_interesting(\''+
  house.desc_hash+
  '\')">Not interesting</a>'+
  '<p>'+
  'size:                 '+
  house.size+
  '</br>estado:            '+
  house.state+
  '</br>price:            '+
  house.price+
  '</br>Publication date:  '+
  house.publication+
  '</br></br>'+
  house.desc+
  '</p>'+
  contentImage+
  '</div>'+
  '</div>';

  $('#house').html(contentString);

};

function create(house, map, markerArray){
  

  
  colorP = color($.trim(house.price.replace("€","")), priceH, priceL);
  var icon_url = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|' + colorP + '|13|b|' + house.size;
  var markerIcon = L.icon({
    iconUrl: icon_url,
    iconAnchor: [14, 47],
    popupAnchor: [0, -47],
  });

  var marker = new L.marker([house.lat, house.lng], {icon: markerIcon});
  marker.on('click', function(){
    currentHouse(house);
  });

  marker.bindPopup("Current house");
  markerArray[house.desc_hash] = marker;
  map.addLayer(markerArray[house.desc_hash]);

};

function initialize(markerArray) {
  divmap = document.getElementById('map');
  var height = $(document).height() - 34;
  divmap.style.height = height+"px";
  divhouse = document.getElementById('house');
  var height = $(document).height() - 34;
  divhouse.style.height = height+"px";

  map = L.map('map').setView([38.73367, -9.1359], 13);

  L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
  }).addTo(map);

  $.get('../item.csv', {}, function(csv) {
    $.csv.toObjects(csv, {}, function(err, houses){
      for (var i in houses){
        if (houses[i].title != "title"){
          create(houses[i], map, markerArray);
        }
      }
    });
  });

};


var markerArray = [];
initialize(markerArray);
