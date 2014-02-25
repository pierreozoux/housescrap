if (Meteor.isClient) {
  Template.form.rendered = function ( ) {
    $('#priceLow').val(Session.get("priceLow"));
    $('#priceHigh').val(Session.get("priceHigh"));
    $('#typeLow').val(Session.get("typeLow"));

    $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 1500,
        values: [ Session.get("priceLow"), Session.get("priceHigh") ],
        slide: function( event, ui ) {
          Session.set("priceHigh", ui.values[ 1 ]);
          Session.set("priceLow", ui.values[ 0 ]);
          $( "#amount" ).html( "€" + ui.values[ 0 ] + " - €" + ui.values[ 1 ] );
        }
      });
      $( "#amount" ).html( "€" + $( "#slider-range" ).slider( "values", 0 ) +
        " - €" + $( "#slider-range" ).slider( "values", 1 ) );
    });

    $('#bed').change(function() {
        Session.set("typeLow",parseInt($('#typeLow').val()));
      }
    );

    document.getElementById('form').style.top = "0px";

    hideForm = function() {
      if (document.getElementById('form').style.top === "0px") {
        document.getElementById('form').style.top = -80 + "px";
        var rotate = "rotate(0.5turn)";
        document.getElementById('chevron').style.webkitTransform = rotate;
      }
    };

    showHideForm = function() {
      if (document.getElementById('form').style.top === "0px") {
        hideForm();
      } else {
        document.getElementById('form').style.top = 0 + "px";
        var rotate = "rotate(0turn)";
        document.getElementById('chevron').style.webkitTransform = rotate;
      }
    };

    $(document).on('click', '#hide-show', function(){
      showHideForm();
    });
  };
}
