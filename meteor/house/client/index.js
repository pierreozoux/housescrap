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

  Deps.autorun(function () {
    console.log("run!");
    t = Session.get("priceLow");
    t2 = Session.get("priceHigh");
    for (var house_id in window.markers){
      console.log(house_id);
      console.log(Houses.find({_id: house_id}));
    }

    // window.markers.forEach(function (marker, house_id) {
    //   console.log("test");
    //   house = Houses.findOne({_id: house_id});
    //   console.log(house);
    //   house.setIcon();
    // });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
