if (Meteor.isClient) {
  Meteor.startup(function () {

    HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);


    Nimbus.Auth.authorized_callback = function() {
      HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);
      console.log("authentication finished o/");
      signIn();
      if (window.actionPending === "favorit") {
        favorit(window.housePending);
      } else if (window.actionPending === "delete") {
        trash(window.housePending);
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
      signOut();
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

    trash = function(desc_hash) {
      if (Nimbus.Auth.authorized()){
        if (! HousesPreferences.findByAttribute("desc_hash", desc_hash)){
          HousesPreferences.create({
            "desc_hash": desc_hash,
            "status": "removed"
          });
          Houses.findOne({desc_hash: desc_hash}).removeFromMap();
        }
      } else {
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
      } else {
        window.actionPending = "favorit";
        window.housePending = desc_hash;
        showLogin();
      }
    };
  });
}
