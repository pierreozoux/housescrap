if (Meteor.isClient) {
    Meteor.startup(function () {
    var sync_string;

    sync_string = "eyJHRHJpdmUiOnsia2V5IjoiODY1NzY0Mzc4NTkwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic2NvcGUiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2RyaXZlIiwiYXBwX25hbWUiOiJIb3VzZVNjcmFwIn0sIkRyb3Bib3giOnsia2V5IjoiIiwic2VjcmV0IjoiIiwiYXBwX25hbWUiOiIifX0"; 

    Nimbus.Auth.setup(sync_string);
    console.log("Nimbus setuped");
  });
}
