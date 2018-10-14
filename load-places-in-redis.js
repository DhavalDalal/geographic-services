// const commands = require('redis-commands');
//
// commands.list.filter(command => command.includes("del")).forEach(command => console.log(command));
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

const PLACES = [
{
  id:"0",
  name: "Mumbai (Bombay)",
  city: "Mumbai",
  state: "Maharashtra",
  country: "IN",
  type: "City",
  latitude: 19.0760,
  longitude: 72.8777,
  createdOn: null
},{
  id:"0",
  name: "Navi Mumbai (New Bombay)",
  city: "Navi Mumbai",
  state: "Maharashtra",
  country: "IN",
  type: "City",
  latitude: 19.077065,
  longitude: 72.998993,
  createdOn: null
},{
  id:"0",
  name: "Lohegaon Airport",
  city: "Pune",
  state: "Maharashtra",
  country: "IN",
  type: "Airport",
  latitude: 18.516726,
  longitude: 73.856255,
  createdOn: null
},{
  id:"0",
  name: "Virar",
  city: "Palghar",
  state: "Maharashtra",
  country: "IN",
  type: "Suburb",
  latitude: 19.465622,
  longitude: 72.806099,
  createdOn: null
},{
  id:"0",
  name: "Thane",
  city: "Thane",
  state: "Maharashtra",
  country: "IN",
  type: "City",
  latitude: 19.218330,
  longitude: 72.978088,
  createdOn: null
},{
  id:"0",
  name: "Stamford",
  city: "Stamford",
  state: "Connecticut",
  country: "US",
  type: "City",
  latitude: 41.053429,
  longitude: -73.538734,
  createdOn: null
},{
  id:"0",
  name: "Newark Liberty International Airport",
  city: "Newark",
  state: "New Jersey",
  country: "US",
  type: "Airport",
  latitude: 40.7026,
  longitude: -74.1878,
  createdOn: null
},{
  id:"0",
  name: "New York City",
  city: "New York City",
  state: "New York",
  country: "US",
  type: "City",
  latitude: 40.730610, 
  longitude:-73.935242,
  createdOn: null
},{
  id:"0",
  name: "Times Square",
  city: "New York City",
  state: "New York",
  country: "US",
  type: "Place",
  latitude: 40.758896, 
  longitude: -73.985130,
  createdOn: null
},{
  id:"0",
  name: "Staten Island",
  city: "New York City",
  state: "New York",
  country: "US",
  type: "Burrogh",
  latitude: 40.579021, 
  longitude:-74.151535,
  createdOn: null
},{
  id:"0",
  name: "Central Park",
  city: "New York City",
  state: "New York",
  country: "US",
  type: "Park",
  latitude: 40.785091, 
  longitude: -73.968285,
  createdOn: null
},{
  id:"0",
  name: "London",
  city: "London",
  state: "London",
  country: "UK",
  type: "City",
  latitude: 51.509865, 
  longitude: -0.118092,
  createdOn: null
},{
  id:"0",
  name: "Buckingham Palace",
  city: "London",
  state: "London",
  country: "UK",
  type: "Palace",
  latitude: 51.501476, 
  longitude: -0.140634,
  createdOn: null
},{
  id:"0",
  name: "Lord's Cricket Ground",
  city: "London",
  state: "London",
  country: "UK",
  type: "Playground",
  latitude: 51.5298,
  longitude: -0.1722,
  createdOn: null
},{
  id:"0",
  name: "Greenwich",
  city: "London",
  state: "London",
  country: "UK",
  type: "Town",
  latitude: 51.476852, 
  longitude: -0.000500,
  createdOn: null
},{
  id:"0",
  name: "Canary Wharf",
  city: "London",
  state: "London",
  country: "UK",
  type: "Place",
  latitude: 51.5054,
  longitude: -0.0235,
  createdOn: null
},{
  id:"0",
  name: "Royal Albert Hall",
  city: "Kensington",
  state: "London",
  country: "UK",
  type: "Theatre",
  latitude: 51.500942, 
  longitude:-0.177498,
  createdOn: null
},{
  id:"0",
  name: "Cambridge University",
  city: "Cambridge",
  state: "England",
  country: "UK",
  type: "University",
  latitude: 52.2053,
  longitude: 0.1218,
  createdOn: null
},{
  id:"0",
  name: "Tokyo Skytree",
  city: "Sumida",
  state: "Tokyo",
  country: "JP",
  type: "Tower",
  latitude: 35.710064,
  longitude: 139.810699,
  createdOn: null
},{
  id:"0",
  name: "Tokyo",
  city: "Tokyo",
  state: "Tokyo",
  country: "JP",
  type: "City",
  latitude: 35.652832, 
  longitude: 139.839478,
  createdOn: null
},{
  id:"0",
  name: "Tokyo University",
  city: "Tokyo",
  state: "Tokyo",
  country: "JP",
  type: "University",
  latitude: 35.625759,
  longitude: 139.341531,
  createdOn: null
},{
  id:"0",
  name: "Imperial Palace",
  city: "Tokyo",
  state: "Tokyo",
  country: "JP",
  type: "Palace",
  latitude: 35.685360, 
  longitude: 139.753372,
  createdOn: null
},{
  id:"0",
  name: "Chiba",
  city: "Chiba",
  state: "Chiba",
  country: "JP",
  type: "City",
  latitude: 35.6051,
  longitude: 140.1233,
  createdOn: null
},{
  id:"0",
  name: "Tokyo Disneyland",
  city: "Tokyo",
  state: "Tokyo",
  country: "JP",
  type: "Park",
  latitude: 35.6329,
  longitude: 139.8804,
  createdOn: null
},{
  id:"0",
  name: "Sensō-ji Temple",
  city: "Asakusa",
  state: "Tokyo",
  country: "JP",
  type: "Temple",
  latitude: 35.7148, 
  longitude: 139.7967,
  createdOn: null
},{
  id:"0",
  name: "Cape Town",
  city: "Cape Town",
  state: "",
  country: "SA",
  type: "City",
  latitude: -33.918861,
  longitude: 18.423300,
  createdOn: null
},{
  id:"0",
  name: "Robben Island",
  city: "Cape Town",
  state: "",
  country: "SA",
  type: "Island",
  latitude: -33.8076, 
  longitude: 18.3712,
  createdOn: null
},{
  id:"0",
  name: "Cape of Good Hope",
  city: "Cape Town",
  state: "",
  country: "SA",
  type: "Rocky Headland",
  latitude: 34.3568,
  longitude: 18.4740,
  createdOn: null
},{
  id:"0",
  name: "Table Mountain",
  city: "Cape Town",
  state: "",
  country: "SA",
  type: "Mountain",
  latitude: -33.9628,
  longitude: 18.4098,
  createdOn: null
},{
  id:"0",
  name: "Johannesburg",
  city: "Johannesburg",
  state: "",
  country: "SA",
  type: "City",
  latitude: -26.2041, 
  longitude: 28.0473,
  createdOn: null
},{
  id:"0",
  name: "The Victoria & Alfred Waterfront",
  city: "Cape Town",
  state: "",
  country: "SA",
  type: "Harbour",
  latitude: -33.9036,
  longitude: 18.4205,
  createdOn: null
}
];

function loadPlacesData(placesArray, redis) {
  return new Promise((resolve, reject) => {
    const places = placesArray.map((place, idx) => {
      if (place.id === "0") {
        place.id = idx + 1
      }
      place.createdOn = Number.parseInt((new Date()).getTime() / 1000).toFixed(0);
      return place;  
    });
    if (places)
      resolve(places);
    else
      reject("No Places found!");
  }).then(places => {
    const promises = places.map(place => {
      const placeId = `location-${place.id}`;
      return redis.geoadd("geo-locations", place.longitude, place.latitude, placeId)
        .then(() => redis.hmset(placeId, place));
    });
    return Promise.all(promises);
  })
}

async function readPlacesDataCount(redis) {
  const result = await redis
    .multi()
    .keys("location-*")
    .zcard("geo-locations")       
    .exec();
  return { 
    locations: (result[0][1]).length, 
    "geo-locations": result[1][1] 
  };
}

async function cleanAllPlacesData(redis) {
  return redis.keys("location-*")
    .then(keys => redis.del("geo-locations", ...keys));
}

async function deletePlaceById(placeId) {
  return redis
   .multi()
   .del(placeId)
   .zrem("geo-locations", placeId)
   .exec();
}

async function loadFreshData(PLACES, redis) {
  try {
    const cleaned = await cleanAllPlacesData(redis);
    console.info("Cleaned Keys = ", cleaned);
    await loadPlacesData(PLACES, redis);
    const counts = await readPlacesDataCount(redis);
    console.info("Records in Keys = ", counts);
  } catch(e) {
    throw e;
  }
}

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

loadFreshData(PLACES, redis)
  .then(result => {
    redis.disconnect();
    console.info("Result = ", result);
  }).catch(error => {
    redis.disconnect();
    console.error("Error = ", error);
  });

  
// deletePlaceById('location-1')
//   .then(result => console.info(result))
//   .then(() => redis.disconnect())
//   .catch(error => console.error(error));
