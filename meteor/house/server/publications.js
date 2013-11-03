Meteor.publish("houses", function (mapSouth, mapNorth, mapWest, mapEast, priceLow, priceHigh, typeLow, typeHigh) {
  return Houses.find({
    "lat": {
      "$gte": mapSouth,
      "$lte": mapNorth
    },
    "lng": {
      "$gte": mapWest,
      "$lte": mapEast
    },
    "price": {
      "$gte": priceLow, 
      "$lte": priceHigh
    },
    "size": {
      "$gte": typeLow, 
      "$lte": typeHigh
    }
  });
});
