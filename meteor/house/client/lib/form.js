if (Meteor.isClient) {
  Template.form.rendered = function ( ) {
    $('#priceLow').val(Session.get("priceLow"));
    $('#priceHigh').val(Session.get("priceHigh"));
    $('#typeLow').val(Session.get("typeLow"));
    $('#typeHigh').val(Session.get("typeHigh"));
  }

  getPrice = function () {
    Session.set("priceLow",parseInt($('#priceLow').val()));
    Session.set("priceHigh",parseInt($('#priceHigh').val()));
  }

  getType = function () {
    Session.set("typeLow",parseInt($('#typeLow').val()));
    Session.set("typeHigh",parseInt($('#typeHigh').val()));
  }
}
