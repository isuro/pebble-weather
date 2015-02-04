var UI = require('ui');
var ajax = require('ajax');

var main = new UI.Card({
  title: ' Forecast',
  body: 'Loading ...',
  icon: 'images/default.png',
});
main.show();

var daily = new UI.Menu({
  sections: []
});

var currentLongitude;
var currentLatitude;
var forecastData;

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  currentLongitude = pos.coords.longitude;
  currentLatitude = pos.coords.latitude;
  
  console.log('lat= ' + currentLatitude + ' lon= ' + currentLongitude);
  
  ajax({ url: "https://api.forecast.io/forecast/65982dd70911a0fcec7431e4ac6d9fb4/" + currentLatitude + 
        ","+ currentLongitude, type: 'json' },
    function(data) {
      main.body(
        data.currently.summary + "\n" +
        data.currently.apparentTemperature + " F"
      );
      main.icon('images/' + data.currently.icon + '.png');
      forecastData = data;
      populateDaily();
      main.on('click', 'select', function(){
        daily.show();
      });
    }
  );
  ajax({ url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + currentLatitude + ','+ 
        currentLongitude + '&result_type=neighborhood&key=AIzaSyDKIrhGbe5a3Aw_7NymonkN--Bsaj_Uf0E', 
        type: 'json'},
    function(data) {
      main.title(" " + data.results[0].address_components[0].short_name);
    }
  );
}

function populateDaily(){
  for (var i = 0; i < forecastData.daily.length; i++){
    daily.sections[i] = {
      title: String(new Date(forecastData.daily[i].time).getMonth() + 1) + "/" +
        String(new Date(forecastData.daily[i].time).getDate()),
      items: [{
              title: forecastData.daily[i].apparentTemperatureMin + " - " + forecastData.daily[i].apparentTemperatureMax,
              subtitle: forecastData.daily[i].summary,
              icon: 'images/' + forecastData[i].icon + '.png'
              }]
    };
  }
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

