Meteor.publish("houses", function (mapSouth, mapNorth, mapWest, mapEast, priceLow, priceHigh, size) {
  return Houses.find({
    "lat": {
      "$gt": mapSouth,
      "$lt": mapNorth
    },
    "lng": {
      "$gt": mapWest,
      "$lt": mapEast
    },
    "price": {
      "$gt": priceLow, 
      "$lt": priceHigh
    }
  });
});
