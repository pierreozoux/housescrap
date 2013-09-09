if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to house.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Meteor.startup(function () {
    markerArray = [];
    var map;
    initialize();
    draw_house();
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
