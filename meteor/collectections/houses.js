function getRandomOffset() {
  var min = 7;
  var max = 50;
  var sign = 0;
  if (Math.random() > 0.5){
    sign = 1;
  } else {
    sign = -1;
  }

  return sign*(Math.floor(Math.random() * (max - min + 1)) + min)/100000;
};

House = function (document) {
  _.extend(this, document);
};

_.extend(House.prototype, {
  setIcon: function () {
    var icon = L.divIcon({
      className: "houses",
      iconSize: [17, 17],
      iconAnchor: [29, 28],
      html: "T" + this.size
    });
    marker = window.markers[this.desc_hash]
    if (marker){
      marker.setIcon(icon);
    }
  },
  setAsFavorit: function () {
    marker = window.markers[this.desc_hash]
    if (marker){
      marker._icon.style.background = "#FF99FF";
      marker._icon.style.zIndex = 1000;
    }
    if (marker._popup._isOpen) {
      document.getElementById(this.desc_hash + '-star').className = "fa fa-star";
    } else {
      marker.bindPopup(house.popupContent(true), { maxWidth: 240, offset: [-14, -22]});
    }
  },
  unsetAsFavorit: function () {
    marker = window.markers[this.desc_hash]
    if (marker){
      marker._icon.style.background = "#FFFFFF";
      marker._icon.style.zIndex = 100;
    }
    document.getElementById(this.desc_hash + '-star').className = "fa fa-star-o"
  },
  addToMap: function () {
    var offsetLat = 0;
    var offsetLng = 0;
    for (var key in window.markers) {
      marker = window.markers[key];
      if (marker.getLatLng().lat === this.lat && marker.getLatLng().lng === this.lng){
        offsetLat = getRandomOffset();
        offsetLng = getRandomOffset();
        break;
      }
    }
    marker = new L.marker([this.lat + offsetLat, this.lng + offsetLng]);
    var house = eval(this);
    marker.bindPopup(house.popupContent(), { maxWidth: 240, offset: [-14, -22]});

    marker.price = this.price;
    marker.house = house;
    if (!window.markers[this.desc_hash]){
      if (Nimbus.Auth.authorized()){
        housePreference = HousesPreferences.findByAttribute("desc_hash", this.desc_hash)
        if (housePreference){
          if (housePreference.status == "removed"){
            return false;
          }
        }
      }
      window.markers[this.desc_hash] = marker;
      this.setIcon();
      window.map.addLayer(marker);
      this.setIconColor();
    }
  },
  removeFromMap: function () {
    marker = window.markers[this.desc_hash]
    if (marker){
      window.map.removeLayer(marker);
      delete window.markers[this.desc_hash];
    }
  },
  setIconColor: function () {
    var priceRange =   Session.get("priceHigh") - Session.get("priceLow"),
        amplitude = $.trim(this.price) - Session.get("priceLow"),
        percentage = amplitude/priceRange,
        blue = 0,
        red,
        green;
    if (percentage < 0.50) {
      green = 255;
      red = Math.round(percentage*2*255);
    } else {
      red = 255;
      green = Math.round(255 - (percentage - 0.50)*2*255);
    }
    var colorHex = ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
    marker = window.markers[this.desc_hash]
    if (marker){
      marker._icon.style.borderColor = "#" + colorHex;
    }
  },
  slideshow: function (number) {    
    var house = this;
    if (house.image_urls[0]) {
      var image = "<img class='image-slide' src=" +
      house.image_urls[number] +
      " height='180' width='240'>";

      var slideshow = image +
      "<div class='nav'>" +
      "<a id='nav-prev'></a>" +
      "<a id='nav-next'></a>" +
      "</div>"

      $('#slide-container').html(slideshow);
      $(document).off('click', '#nav-prev');
      $(document).off('click', '#nav-next');

      $(document).on('click', '#nav-prev', function(){
        if (house.image_urls[number - 1 ]){
          house.slideshow(number - 1);
        } else {
          house.slideshow(house.image_urls.length - 1);
        }
      });
      $(document).on('click', '#nav-next', function(){
        if (house.image_urls[number + 1 ]){
          house.slideshow(number + 1);
        } else {
          house.slideshow(0);
        }
      });  
    } else {
      $('#slide-container').html("No preview available..");
    }
  },
  popupContent: function(favorit) {
    house = this;

    function title() {
      title = house.address.replace("Lisboa", "").trim();
      if (title === ""){
        return "Lisboa";
      } else {
        return title;
      }
    }

    if (favorit) {
      classStar = "fa-star";
    } else {
      classStar = "fa-star-o";
    }

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+
    '<a href="'+
    this.link+
    '" target="_blank">'+
    title()+
    '</a>'+
    '<i id="'+this.desc_hash+'-star" class="fa ' + classStar + '" onclick="favorit(\''+
    this.desc_hash+
    '\')"></i>'+
    '<i class="fa fa-trash-o" onclick="remove(\''+
    this.desc_hash+
    '\')"></i>'+
    '</h1>'+
    '<div id="bodyContent">'+
    '<p>'+
    '</br>Price:            '+
    this.price+
    '€'+
    '</br>Estado:            '+
    this.state+
    '</br>Publication date:  '+
    this.publication+
    '</br></br>'+
    '<div id="slide-container"></div>'
    '</p>'+
    //this.desc+
    '</div>'+
    '</div>';

    return contentString
  }
});

Houses = new Meteor.Collection("houses",{
  transform: function (document) {
    return new House(document);
  }
});

