if (Meteor.isClient) {
  Meteor.startup(function () {

    HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);


    Nimbus.Auth.authorized_callback = function() {
      HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);
      console.log("authentication finished o/");
      var dataStoreHtml = "You are now Logged in!" +
        "</br><center>" +
        "<button type='button' class='pure-button button-warning'" +
        "onclick='auth()'>Log out!</button></center>";
      document.getElementById("data-store").innerHTML = dataStoreHtml;
      hideLogin();
      if (window.actionPending === "favorit") {
        favorit(window.housePending);
      } else if (window.actionPending === "delete") {
        remove(window.housePending);
      }
      window.actionPending = null;
      window.housePending = null;
      checkAllHouses();
    };

    checkAllHouses = function() {
      // remove houses
      HousesPreferences.findAllByAttribute(
        "status",
        "removed"
      ).forEach(function(housePreference){
        house = Houses.findOne({desc_hash: housePreference.desc_hash});
        if (house){
          house.removeFromMap();
        }
      });

      // favorit houses
      HousesPreferences.findAllByAttribute(
        "status",
        "favorit"
      ).forEach(function(housePreference){
        house = Houses.findOne({desc_hash: housePreference.desc_hash});
        if (house){
          house.setAsFavorit();
        }
      });
    };

    logOut = function() {
      Nimbus.Auth.logout();
      console.log("Logged Out");
      var dataStoreHtml = "In order to save your preferences, " +
        "please login with your Google account." +
        "<center><img id='google' src='images/google.png'" +
        " onclick='auth()''></center>";
      document.getElementById("data-store").innerHTML = dataStoreHtml;
    };

    auth = function() {
      if (Nimbus.Auth.authorized()){
        logOut();
      }else{
        connectGoogle();
      }
    };

    connectDropbox = function() {
      Nimbus.Auth.authorize('Dropbox');
      console.log("Connect Dropbox....");
    };
    
    connectGoogle = function() {
      Nimbus.Auth.authorize('GDrive');
      console.log("Connect Google....");
    };

    remove = function(desc_hash) {
      if (Nimbus.Auth.authorized()){
        if (! HousesPreferences.findByAttribute("desc_hash", desc_hash)){
          HousesPreferences.create({
            "desc_hash": desc_hash,
            "status": "removed"
          });
          Houses.findOne({desc_hash: desc_hash}).removeFromMap();
        }
      }else {
        window.actionPending = "delete";
        window.housePending = desc_hash;
        showLogin();
      }
    };

    favorit = function(desc_hash) {
      if (Nimbus.Auth.authorized()){
        if (! HousesPreferences.findByAttribute("desc_hash", desc_hash)){
          console.log("saving...");
          HousesPreferences.create({
            "desc_hash": desc_hash,
            "status": "favorit"
          });
          Houses.findOne({desc_hash: desc_hash}).setAsFavorit();
        } else {
          console.log("deleting from favorit...");
          HousesPreferences.findByAttribute({"desc_hash": desc_hash}).destroy();
          Houses.findOne({desc_hash: desc_hash}).unsetAsFavorit();
        }
      }else {
        window.actionPending = "favorit";
        window.housePending = desc_hash;
        showLogin();
      }
    };

    showLogin = function() {
      $("#background-popup").unbind(
        "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
      );
      document.getElementById('background-popup').style.visibility = "visible";
      document.getElementById('data-store').style.top = 0+"px";
      document.getElementById('background-popup').style.opacity = 1;
    };

    hideLogin = function() {
      document.getElementById('background-popup').style.opacity = 0;
      $("#background-popup").bind(
        "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
        function() {
        document.getElementById('background-popup').style.visibility = "hidden";
      });
      document.getElementById('data-store').style.top = -172+"px";
    };
  });
}
