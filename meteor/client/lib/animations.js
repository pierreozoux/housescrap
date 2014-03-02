if (Meteor.isClient) {
  hideBackground = function() {
    document.getElementById('background-popup').style.opacity = 0;
    $("#background-popup").bind(
      "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
      function() {
      document.getElementById('background-popup').style.visibility = "hidden";
    });
  };

  showBackground = function() {
    $("#background-popup").unbind(
      "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
    );
    document.getElementById('background-popup').style.visibility = "visible";
    document.getElementById('background-popup').style.opacity = 1;
  };

  hideAbout = function() {
    console.log("ovubhreoin");
    hideBackground();
    document.getElementById('about').style.bottom = -120 + "px";
    $('background-popup').off( "click", hideAbout);
    $('#open-about').off( "click", hideAbout);
    var rotate = "rotate(0turn)";
    document.getElementById('chevron-about').style.webkitTransform = rotate;
  };

  showAbout = function() {
    showBackground();
    document.getElementById('about').style.bottom = 200 + "px";
    $('#background-popup').on( "click", hideAbout);
    $('#open-about').on( "click", hideAbout);
    var rotate = "rotate(0.5turn)";
    document.getElementById('chevron-about').style.webkitTransform = rotate;
  };

  $( window ).resize(function() {
    // resize map
    var height = window.innerHeight;
    var width = window.innerWidth;
    document.getElementById('map').style.height = height+"px";
    document.getElementById('map').style.width = width+"px";

    // put the form div in the center
    document.getElementById("form").style.left = ((width - 460)/2) + "px";
    document.getElementById("data-store").style.left = ((width - 400)/2) + "px";

    // put the about div in the center
    document.getElementById("about").style.left = ((width - 400)/2) + "px";
    document.getElementById("about-button").style.left = ((width - 100)/2) + "px";
  });
}
