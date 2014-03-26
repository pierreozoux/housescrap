if (Meteor.isClient) {
  showBackground = function() {
    $("#background-popup").unbind(
      "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
    );
    document.getElementById("background-popup").style.visibility = "visible";
    document.getElementById("background-popup").style.opacity = 1;
  };

  hideBackground = function() {
    document.getElementById("background-popup").style.opacity = 0;
    $("#background-popup").bind(
      "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
      function() {
        document.getElementById("background-popup").style.visibility = "hidden";
    });
  };

  showAbout = function() {
    hideLogin();
    showBackground();
    var height = window.innerHeight;
    document.getElementById("about").style.bottom = ((height - document.getElementById("about").clientHeight)/2) + "px";
    $('#background-popup').on( "click", hideAbout);
    $('#open-about').on( "click", hideAbout);
    var rotate = "rotate(0.5turn)";
    document.getElementById("chevron-about").style.webkitTransform = rotate;
  };

  hideAbout = function() {
    hideBackground();
    document.getElementById("about").style.bottom = -document.getElementById("about").clientHeight + "px";
    $("background-popup").off( "click", hideAbout);
    $("#open-about").off( "click", hideAbout);
    var rotate = "rotate(0turn)";
    document.getElementById("chevron-about").style.webkitTransform = rotate;
  };

  showLogin = function() {
    hideAbout();
    showBackground();
    $("#sign-in-button").addClass("pure-button-disabled");
    document.getElementById("login").style.top = 0+"px";
    $('#background-popup').on( "click", hideLogin);
  };

  hideLogin = function() {
    hideBackground();
    $("#sign-in-button").removeClass("pure-button-disabled");
    $('#background-popup').off( "click", hideLogin);
    document.getElementById('login').style.top = -document.getElementById('login').clientHeight+"px";
  };

  signIn = function() {
    hideLogin();
    $("#sign-in-button").removeClass("button-sign-in").addClass("button-sign-out");
    document.getElementById("sign-in-button").innerHTML = "Sign out";
    document.getElementById("sign-in-button").onclick = logOut;
  };

  signOut = function() {
    $("#sign-in-button").removeClass("button-sign-out").addClass("button-sign-in");
    document.getElementById("sign-in-button").innerHTML = "Sign in";
    document.getElementById("sign-in-button").onclick = showLogin;
  };

  $( window ).resize(function() {
    // resize map
    var height = window.innerHeight;
    var width = window.innerWidth;
    document.getElementById("map").style.height = height+"px";
    document.getElementById("map").style.width = width+"px";

    // put the form div in the center
    document.getElementById("form").style.left = ((width - document.getElementById("form").clientWidth)/2) + "px";
    document.getElementById("login").style.left = ((width - document.getElementById("login").clientWidth)/2) + "px";
    document.getElementById("login").style.top = - document.getElementById('about').clientHeight + "px";

    // put the about div in the center
    document.getElementById("about").style.left = ((width - document.getElementById("about").clientWidth)/2) + "px";
    document.getElementById("about-button").style.left = ((width - document.getElementById("about-button").clientWidth)/2) + "px";
    document.getElementById("about").style.bottom = - document.getElementById("about").clientHeight + "px";
  });
}
