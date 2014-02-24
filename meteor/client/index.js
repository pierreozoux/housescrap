if (Meteor.isClient) {

  Session.setDefault("priceLow", 300);
  Session.setDefault("priceHigh", 350);
  Session.setDefault("typeLow", 0);
  window.markers = [];

  Template.map.rendered = function ( ) {
    $(window).resize();
    window.map = initializeMap();
    window.map.on('moveend', setBounds);
    setBounds();
  }

  // When price change, redraw houses
  Meteor.startup(function () {
    Deps.autorun(function () {
      Meteor.subscribe("houses",
        Session.get("south"),
        Session.get("north"),
        Session.get("west"),
        Session.get("east"),
        Session.get("priceLow"), 
        Session.get("priceHigh"), 
        Session.get("typeLow")
      );

      checkAllHouses();
    });
    
    Deps.autorun(function () {
      Houses.find({"price": {"$gt": Session.get("priceLow"), "$lt": Session.get("priceHigh")}}).forEach(function (house) {
        house.setIcon();
        house.setIconColor();
      });
    });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
