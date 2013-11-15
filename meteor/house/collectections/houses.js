House = function (document) {
  _.extend(this, document);
};

_.extend(House.prototype, {
  setIcon: function () {
    var icon = L.divIcon({
      className: "houses",
      iconSize: [22, 21],
      iconAnchor: [30, 28],
      html: "T" + this.size
    });
    window.markers[this._id._str].setIcon(icon);
  },
  addToMap: function () {
    marker = new L.marker([this.lat, this.lng]);
    var house = eval(this);
    marker.on('click', function(){
      house.show();
    });
    marker.bindPopup("Current house", { offset: [-10, -22]});
    marker.price = this.price;
    window.markers[this._id._str] = marker;
    this.setIcon();
    window.map.addLayer(marker);
    this.setIconColor();
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
    window.markers[this._id._str]._icon.style.borderColor = "#" + colorHex;
  },
  show: function () {
    var contentImage = "";

    for (var i in this.image_urls){
      contentImage += '<a href="'
      contentImage += this.image_urls[i]
      contentImage += '" rel="lightbox[house:images]" title="my caption"><img src="'
      contentImage += this.image_urls[i]
      contentImage += '" height="60" width="80"></a>'
    };

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+
    '<a href="'+
    this.link+
    '" target="_blank">'+
    this.address+
    '</a>'+
    '</h1>'+
    '<div id="bodyContent">'+
    '<button type="button" class="btn btn-danger" onclick="not_interesting(\''+
    this.desc_hash+
    '\')">Not interesting</button>'+
    '<p>'+
    'size: T'+
    this.size+
    '</br>estado:            '+
    this.state+
    '</br>price:            '+
    this.price+"€"+
    '</br>Publication date:  '+
    this.publication+
    '</br></br>'+
    contentImage+
    '</p>'+
    this.desc+
    '</div>'+
    '</div>';

    $('#house').html(contentString);
  },
  removeFromMap: function () {
    window.map.removeLayer(window.markers[this._id._str]);
  }

});

Houses = new Meteor.Collection("houses",{
  transform: function (document) {
    return new House(document);
  }
});

