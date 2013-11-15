if (Meteor.isClient) {
  Meteor.startup(function () {
    Houses.find({}).observe({
      added: function(house) {
        house.addToMap();
      },
      removed: function(house) {
        house.removeFromMap();
      }
    });
  });
}
