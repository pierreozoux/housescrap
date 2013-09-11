if (Meteor.isClient) {

  var priceHigh = 500;
  var priceLow = 300;

  function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  function color(price, priceHigh, priceLow){
    var priceRange = priceHigh - priceLow;
    var amplitude = price - priceLow;
    var percentage = amplitude/priceRange;
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
    console.log(house.image_urls);

    for (var i in house.image_urls){
      contentImage += '<a href="'
      contentImage += house.image_urls[i]
      contentImage += '" rel="lightbox[test]" title="my caption"><img src="'
      contentImage += house.image_urls[i]
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

  function create(house){
    colorP = color($.trim(house.price), priceHigh, priceLow);
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

  draw_house = function(map){
    Houses.find().forEach(function(house){
        create(house);
    });
  };
}
