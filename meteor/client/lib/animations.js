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

}
