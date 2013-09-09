Meteor.publish("houses", function () {
  return Houses.find({});
});
