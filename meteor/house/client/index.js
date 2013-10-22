if (Meteor.isClient) {

  Session.setDefault("location", "");
  Session.setDefault("priceLow", 300);
  Session.setDefault("priceHigh", 500);
  Session.setDefault("size", "");
  window.markers = [];

  Template.map.rendered = function ( ) {
    window.map = initializeMap();
  }

  Deps.autorun(function () {
    Meteor.subscribe("houses", 
      Session.get("location"), 
      Session.get("priceLow"), 
      Session.get("priceHigh"), 
      Session.get("size")
    );
  });

  Meteor.startup(function () {
    Deps.autorun(function () {
      Houses.find({"price": {"$gt": Session.get("priceLow"), "$lt": Session.get("priceHigh")}}).forEach(function (house) {
        house.setIcon();
      });
    });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
