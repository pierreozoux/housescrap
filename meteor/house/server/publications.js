Meteor.publish("houses", function (location, priceLow, priceHigh, size) {
  return Houses.find({"price": {"$gt": priceLow, "$lt": priceHigh}});
});
