date30DaysAgo = new Date();
date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
date30DaysAgoInSeconds = date30DaysAgo.getTime() / 1000;
console.log(date30DaysAgoInSeconds);

Houses.find({
  "publication": {
    $lt: date30DaysAgoInSeconds
  }
}).forEach(function (house) {
  console.log(house.desc_hash);
});
