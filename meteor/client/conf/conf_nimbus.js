if (Meteor.isClient) {
  Meteor.startup(function () {
    var syncString = "eyJHRHJpdmUiOnsia2V5IjoiODY1NzY0Mzc4NTkwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic2NvcGUiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2RyaXZlIiwiYXBwX25hbWUiOiJIb3VzZVNjcmFwIn0sIkRyb3Bib3giOnsia2V5IjoiIiwic2VjcmV0IjoiIiwiYXBwX25hbWUiOiIifX0=";

    Nimbus.Auth.setup(syncString);
    console.log("Nimbus setuped");
  });
}
