if (Meteor.isClient) {
  Meteor.startup(function () {
    Houses.find({}).observe({
      added: function(house) {
        house.addToMap();
        console.log("2added");
      },
      removed: function(house) {
        house.removeFromMap();
        console.log("deleted");
      }
    });
  });
}
