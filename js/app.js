(function() {

  // Nimbus.Auth.authorized_callback = function() { 
  //   console.log("authentication finished o/");
  //   Houses = Nimbus.Model.setup("Houses", ["desc_hash"]);
  // };

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
    Houses = Nimbus.Model.setup("Houses", ["desc_hash"]);
    if (Nimbus.Auth.authorized()){
      Houses.create({"desc_hash": desc_hash});
      console.log(desc_hash + ' should be removed');
    }else {
      alert("Please log-in!");
    }
    Houses.sync_all( function(){ 
      console.log("Everything is synced after save");
    });
  };

}).call(this);
