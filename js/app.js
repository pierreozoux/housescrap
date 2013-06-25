(function() {

  Houses = Nimbus.Model.setup("Houses", ["desc_hash"]);


  Nimbus.Auth.authorized_callback = function() {
    Houses = Nimbus.Model.setup("Houses", ["desc_hash"]);
    console.log("authentication finished o/");

    Houses.each(function(house){
      map.removeLayer(markerArray[house.desc_hash]);
    });
  };

  log_out = function() {
    Nimbus.Auth.logout();
    console.log("Logged Out");
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
      if (! Houses.findByAttribute("desc_hash", desc_hash)){
        Houses.create({"desc_hash": desc_hash});
        console.log(desc_hash + ' should be removed');
        map.removeLayer(markerArray[desc_hash]);
        $('#house').html('');
      }else {
        console.log("House already deleted");
      }
    }else {
      alert("Please log-in!");
    }
  };

}).call(this);
