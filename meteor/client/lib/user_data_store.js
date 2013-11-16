if (Meteor.isClient) {
  Meteor.startup(function () {

    HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);


    Nimbus.Auth.authorized_callback = function() {
      HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash", "status"]);
      console.log("authentication finished o/");
      document.getElementById("auth").innerHTML="Log out!";
      check_all_houses();
    };

    check_all_houses = function() {
      // remove hosues
      HousesPreferences.findAllByAttribute("status", "removed").forEach(function(housePreference){
        console.log(housePreference.desc_hash);
        house = Houses.findOne({desc_hash: housePreference.desc_hash})
        if (house){
          house.removeFromMap();
        }
      });

      // favorit houses
      HousesPreferences.findAllByAttribute("status", "favorit").forEach(function(housePreference){
        house = Houses.findOne({desc_hash: housePreference.desc_hash})
        if (house){
          house.setAsFavorit();
        }
      });
    };

    log_out = function() {
      Nimbus.Auth.logout();
      console.log("Logged Out");
      document.getElementById("auth").innerHTML="Connect with Google!";
    };

    auth = function() {
      if (Nimbus.Auth.authorized()){
        log_out();
      }else{
        connect_google();
      }
    };    

    connect_dropbox = function() {
      Nimbus.Auth.authorize('Dropbox');
      console.log("Connect Dropbox....");
    };
    
    connect_google = function() {
      Nimbus.Auth.authorize('GDrive');
      console.log("Connect Google....");
    };

    not_interesting = function(desc_hash) {
      if (Nimbus.Auth.authorized()){
        if (! HousesPreferences.findByAttribute("desc_hash", desc_hash)){
          console.log(desc_hash + ' should be removed');
          HousesPreferences.create({"desc_hash": desc_hash, "status": "removed"});
          Houses.findOne({desc_hash: desc_hash}).removeFromMap();
          $('#house').html('');
        }
      }else {
        alert("Please connect with google!");
      }
    };

    favorit = function(desc_hash) {
      if (Nimbus.Auth.authorized()){
        console.log(desc_hash);
        if (! HousesPreferences.findByAttribute("desc_hash", desc_hash)){
          console.log("saving...");
          HousesPreferences.create({"desc_hash": desc_hash, "status": "favorit"});
          Houses.findOne({desc_hash: desc_hash}).setAsFavorit();
        }
      }else {
        alert("Please connect with google!");
      }
    };
  });
}
