var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
  title: ' Forecast',
  body: 'Loading ...',
  icon: 'images/default.png'
});
var currentLongitude;
var currentLatitude;
main.show();

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  currentLongitude = pos.coords.longitude;
  currentLatitude = pos.coords.latitude;
  
  console.log('lat= ' + currentLatitude + ' lon= ' + currentLongitude);
  
  ajax({ url: "https://api.forecast.io/forecast/65982dd70911a0fcec7431e4ac6d9fb4/" + currentLatitude + ","+ currentLongitude, type: 'json' },
    function(data) {
      main.body(
        data.currently.summary + "\n" +
        data.currently.apparentTemperature + " F"
      );
      main.icon('images/' + data.currently.icon + '.png');
    }
  );
  ajax({ url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + currentLatitude + ','+ currentLongitude + '&result_type=neighborhood&key=AIzaSyDKIrhGbe5a3Aw_7NymonkN--Bsaj_Uf0E', type: 'json'},
    function(data) {
      main.title(" " + data.results[0].address_components[0].short_name);
    }
  );
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

