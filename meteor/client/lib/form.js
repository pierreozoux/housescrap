if (Meteor.isClient) {
  Template.form.rendered = function ( ) {
    $('#priceLow').val(Session.get("priceLow"));
    $('#priceHigh').val(Session.get("priceHigh"));
    $('#typeLow').val(Session.get("typeLow"));
  }

  getValue = function () {
    Session.set("priceLow",parseInt($('#priceLow').val()));
    Session.set("priceHigh",parseInt($('#priceHigh').val()));
    Session.set("typeLow",parseInt($('#typeLow').val()));
  }
}
