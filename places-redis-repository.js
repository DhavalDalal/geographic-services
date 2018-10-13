const Redis = require('ioredis');
const redis = new Redis(6379, 'localhost');

// console.debug(`Nearby Places Data...`);
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    let value = v;
    if (v === "null") {
      value = null;
    }
    if (v === "true" || v === "false") {
      value = Boolean(v);
    }
    if (Number(v)) {
      value = Number(v);
    }
    obj[k] = value;
  }
  return obj;
}

function chunkArray(arr, chunkSize) {
  let groups = [], i;
  for (i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize));
  }
  return groups;
}

Redis.Command.setReplyTransformer('hgetall', function (result) {
  if (Array.isArray(result)) {
    return strMapToObj(new Map(chunkArray(result, 2)));
  }
  return result;
});

const randomNumberBetween = function(min, max, decimalPlaces = 0) {
	// return Math.floor(Math.random() * (max - min + 1) + min);
	// return decimal value
	let decimalValue = (Math.random() * (max - min)) + min;
	if (decimalPlaces === 0)
		return Number.parseInt(decimalValue.toFixed(decimalPlaces));
	else
		return Number.parseFloat(decimalValue.toFixed(decimalPlaces));
};

const getAllPlaces = function() {
	console.log(`getAllPlaces()`);
  return redis.keys("location-*")
    .then(keys => Promise.all(keys.map(key => redis.hgetall(key))));
}

const getPlacesNearby = function(placeName, withinRadius = 10, unit = 'km') {
  console.log(`getPlacesNearby(${placeName},${withinRadius},${unit})`);
  return getAllPlaces()
    .then(places => places.filter(place => place.name.includes(placeName)))
    .then(places => {
      if (places.length == 0)
        throw new Error(`${placeName} Not Found!`);
      else {
        return Promise.all(places.map(place => getPlacesAround(place.latitude, place.longitude, withinRadius, unit)));
      }
    });
};

const getPlacesAround = function(latitude, longitude, withinRadius = 10, unit = 'km') {
  console.log(`getPlacesAround(${latitude},${longitude},${withinRadius},${unit})`);
  return redis.georadius("geo-locations", latitude, longitude, withinRadius, unit)
    .then(keys => Promise.all(keys.map(key => redis.hgetall(key))));
};

module.exports = {
	getPlacesAround: getPlacesAround,
	getPlacesNearby: getPlacesNearby,
	getAllPlaces: getAllPlaces
}
