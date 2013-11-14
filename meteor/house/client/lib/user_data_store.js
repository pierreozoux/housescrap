if (Meteor.isClient) {
  Meteor.startup(function () {

    HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash"]);


    Nimbus.Auth.authorized_callback = function() {
      HousesPreferences = Nimbus.Model.setup("Houses", ["desc_hash"]);
      console.log("authentication finished o/");
      document.getElementById("auth").innerHTML="Log out!";

      houses_to_remove = [];
      HousesPreferences.each(function(house){
        houses_to_remove.push(house.desc_hash);
      });

      Houses.find({}).forEach(function(house){
        to_remove = houses_to_remove.indexOf(house.desc_hash);
        console.log(to_remove);
        if (to_remove >= 0) {
          console.log("it has to be removed");
          house.removeFromMap();
        }
      });

    }

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
          HousesPreferences.create({"desc_hash": desc_hash});
          console.log(desc_hash + ' should be removed');
          Houses.findOne({desc_hash: desc_hash}).removeFromMap();
          $('#house').html('');
        }else {
          console.log("House already deleted");
        }
      }else {
        alert("Please connect with google!");
      }
    };
  });
}
