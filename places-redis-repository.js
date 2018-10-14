const Redis = require('ioredis');

let redis_host = 'localhost';
let redis_port = 6379;
let redis_password = '';

if (process.env.REDIS_URL && process.env.REDIS_PORT && process.env.REDIS_PASSWORD) {
  redis_host = process.env.REDIS_URL;
  redis_port = process.env.REDIS_PORT;
  redis_password = process.env.REDIS_PASSWORD;
}

console.info(`Connecting to Redis redis://${redis_host}:${redis_port}...`);
const redis = new Redis({
  port: redis_port,  
  host: redis_host,  
  family: 4,  // 4 (IPv4) or 6 (IPv6)
  password: redis_password,
  db: 0
});

redis.on('error', (err) => {
  console.info(`Failed to connect to Redis at URL redis://${redis_host}:${redis_port}...${err.message}`);
  console.info("Please make sure Redis Server is running at the specified URL...I will auto-connect!");
});

const delayInMillis = process.env.DELAY_IN_MILLIS || 3000;

function delay(timeInMillis, result) {
  return new Promise((resolve, reject) => {
	setTimeout(() => resolve(result), timeInMillis);
  });
}

function flattenDeep(array) {
  return array.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

function uniqueBy(array, key) {
  const seen = new Set();
  return array.filter(item => {
    var k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

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

const getAllPlaces = function() {
  console.log(`getAllPlaces()`);
  return redis.keys("location-*")
    .then(keys => Promise.all(keys.map(key => redis.hgetall(key))))
    .then(result => delay(delayInMillis, result));
}

const getPlacesNearby = function(placeName, withinRadius = 10, unit = 'km') {
  console.log(`getPlacesNearby(${placeName},${withinRadius},${unit})`);
  return getAllPlaces()
    .then(places => places.filter(place => place.name.includes(placeName)))
    .then(places => {
      if (places.length == 0)
        throw new Error(`${placeName} Not Found!`);
      else {
        return Promise.all(places.map(place => getPlacesAround(place.latitude, place.longitude, withinRadius, unit)))
          .then(results => uniqueBy(flattenDeep(results), place => place.id));
      }
    });
};

const getPlacesAround = function(latitude, longitude, withinRadius = 10, unit = 'km') {
  console.log(`getPlacesAround(${latitude},${longitude},${withinRadius},${unit})`);
  return redis.georadius("geo-locations", longitude, latitude, withinRadius, unit)
    .then(keys => Promise.all(keys.map(key => redis.hgetall(key))))
    .then(result => delay(delayInMillis, result));
};

module.exports = {
  getPlacesAround: getPlacesAround,
  getPlacesNearby: getPlacesNearby,
  getAllPlaces: getAllPlaces
}
