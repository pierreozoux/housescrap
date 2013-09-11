if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to house.";
  };

  Session.setDefault("location", "");
  Session.setDefault("priceLow", 300);
  Session.setDefault("priceHigh", 500);
  Session.setDefault("size", "");

  Meteor.startup(function () {
    markerArray = [];
    var map;
    initialize();
    Meteor.autorun(function() {
      Meteor.subscribe("houses", 
        Session.get("location"), 
        Session.get("priceLow"), 
        Session.get("priceHigh"), 
        Session.get("size"),
        draw_house(map)
      );
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
