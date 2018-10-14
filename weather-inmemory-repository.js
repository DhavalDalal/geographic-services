const delayInMillis = process.env.DELAY_IN_MILLIS || 3000;

// console.debug(`Weather Data...`);
const CITIES = [{
  country: 'IN',
  name: 'Mumbai',
  location: { lat: 19.0760, lon: 72.8777 },
  temperature : { value: 27, low: 24, high: 32, unit: "Celcius"},
  sunshine: "Mostly sunny"
}, {
  country: 'US',
  name: 'New York',
  location: { lat: 40.7306, lon:-73.9352 },
  temperature : { value: 27, low: 24, high: 32, unit: "Celcius"},
  sunshine: "Thunderstorm with light rain"
}, {
  country: 'UK',
  name: 'London',
  location: { lat: 51.509865, lon: -0.118092 },
  temperature : { value: 21, low: 17, high: 24, unit: "Celcius"},
  sunshine: "Partly cloudy"
}, {
  country: 'JP',
  name: 'Tokyo',
  location: { lat: 35.6895, lon: 139.6917 },
  temperature : { value: 19, low: 17, high: 24, unit: "Celcius"},
  sunshine: "Rain"
}, {
  country: 'SA',
  name: 'Cape Town',
  location: { lat: -33.918861, lon: 18.423300},
  temperature : { value: 19, low: 12, high: 23, unit: "Celcius"},
  sunshine: "Cloudy and Rain"
}
];

const randomNumberBetween = function(min, max, decimalPlaces = 0) {
  const decimalValue = (Math.random() * (max - min)) + min;
  if (decimalPlaces === 0)
	return Number.parseInt(decimalValue.toFixed(decimalPlaces));
  else
	return Number.parseFloat(decimalValue.toFixed(decimalPlaces));
};

function executeAfter(timeInMillis, fn, ...args) {
  return new Promise((resolve, reject) => {
	setTimeout(() => resolve(fn(args)), timeInMillis);
  });
}

const getAllCitiesWeather = function() {
  console.log(`getAllCitiesWeather()`);
  return executeAfter(delayInMillis, () => {
  	const cities = [];
  	CITIES.forEach(city => {
      city.temperature.value = randomNumberBetween(city.temperature.low, city.temperature.high);
      cities.push(city);
  	});
  	return cities;
  });
};

const getWeather = function(cityName, countryCode) {
  console.log(`getWeather(${cityName}, ${countryCode})`);
  return getAllCitiesWeather()
    .then(cities => {
      return cities.filter(city => {
        if (cityName && countryCode) 
          return city.name === cityName && city.country === countryCode;
        if (cityName) 
          return city.name === cityName;
      });
    }).then(found => {
      if (found.length == 0)
        throw new Error(`${city}, ${country} Not found!`);
  	  else if (found.length == 1)
  		  return found[0];
      else
        return found;
    });
};

const isLocationWithin = 
  ({lat: cityLat, lon: cityLon}, {lat: expLat, lon: expLon}, tolerance) =>
      isWithin(cityLat, expLat, tolerance) && isWithin(cityLon, expLon, tolerance);

function isWithin(actual, expected, tolerance) {
  const upper = expected + tolerance;
  const lower = expected - tolerance;
  return actual <= upper && actual >= lower;
}

const getWeatherBy = function(expected = {lat:latitude, lon:longitude}, tolerance = 0.5) {
  console.log(`getWeatherBy({${expected.lat}, ${expected.lon}}, ${tolerance})`);
  return getAllCitiesWeather()
    .then(cities => 
      cities.filter(city => isLocationWithin(city.location, expected, tolerance))
    ).then(found => {
      if (found.length == 0)
        throw new Error(`Latitude: ${expected.lat}, Longitude: ${expected.lon} Not found within ${tolerance} tolerance!`);
  	  else if (found.length == 1)
  		  return found[0];
      else
        return found;
    });
};

module.exports = {
  getAllCitiesWeather: getAllCitiesWeather,
  getWeather: getWeather,
  getWeatherBy:getWeatherBy
}
