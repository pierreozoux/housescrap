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

function create(house, map){
  colorP = color($.trim(house.price.replace("€","")), priceH, priceL);
  var icon = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=0.7|0|' + colorP + '|13|b|' + house.size;

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

  var infowindow = new google.maps.InfoWindow({
      content: contentString
  });

  var houseLatLng = new google.maps.LatLng(house.lat, house.lng);
  var houseMarker = new google.maps.Marker({
      position: houseLatLng,
      map: map,
      icon: icon
  });

  google.maps.event.addListener(houseMarker, 'click', function() {
    infowindow.open(map,houseMarker);
  });

};

function initialize() {

  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'),
                                mapOptions);


  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

  $.get('../item.csv', {}, function(csv) {
    $.csv.toObjects(csv, {}, function(err, houses){
      for (var i in houses){
        //console.log(houses[i])
        create(houses[i], map);
      }
    });
    
      // console.log(houses)
    //for (var house in data){
      //   console.log(house);
      //   //create(house,)
      // }
    });

}


google.maps.event.addDomListener(window, 'load', initialize);


