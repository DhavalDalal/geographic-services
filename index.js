const express = require('express')
const path = require('path');
const url = require('url');
const weatherdata = require('./weather-inmemory-repository')
const placesdata = require('./places-redis-repository')

function sendJson(response, statusCode, object) {
	response.setHeader('Content-Type', 'application/json');
	response.status(statusCode);
	response.send(JSON.stringify(object));
}

function sendErrorJson(response, statusCode, errMessage) {
	sendJson(response, statusCode, {
		error: errMessage
	});
}

function isSecure(req) {
	return req.headers['x-forwarded-proto'] === 'https';
}

function useSecureProtocolIfRequired(req, protocol) {
	if (protocol === undefined) {
		return req.protocol;
	}
	return isSecure(req) ? protocol.replace(':', 's:') : protocol;
	console.log(`Modified Protocol = ${modifiedProtocol}`);
}

function fullUrl(req, protocol) {
	return url.format({
		protocol: useSecureProtocolIfRequired(req, protocol),
		host: req.get('host'),
		pathname: req.originalUrl,
		slashes: true
	});
}

async function sendWeather(res, latitude, longitude) {
	try {
    const tolerance = 0.5;
    console.info(`getWeatherBy(${latitude}, ${longitude}, ${tolerance})`);
    sendJson(res, 200, await weatherdata.getWeatherBy({lat:latitude, lon:longitude}, tolerance));
	} catch (e) {
		sendErrorJson(res, 404, e.message);
	}
}

let app = express()
	.use(express.static(__dirname + '/public'))
	//This is important for /public to work in links and script tags
	.use('/public', express.static(__dirname + '/public'))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/', (req, res) => {
		res.render('pages/index', {
			req: fullUrl(req)
		});
	})
	//   .post('/weather', (req, res) => {
	//   	console.info("Posting a new city weather", req.route.stack);
	//    sendJson(res, 200, city);
	//   })
  .get('/weather', (req, res) => {
    const latitude = Number.parseFloat(req.query.lat);
    const longitude = Number.parseFloat(req.query.lon);
    if (latitude && longitude) {
      sendWeather(res, latitude, longitude);
    } else {
      console.info("Got req for weather at all cities...");
      weatherdata.getAllCitiesWeather()
        .then(result => sendJson(res, 200, result));
    }
  })
  .get('/weather/:city', async (req, res) => {
    const city = req.params.city;
		console.info(`Got req for ${city}...`);
		try {
			sendJson(res, 200, await weatherdata.getWeather(city));
		} catch (e) {
			sendErrorJson(res, 404, e.message);
		}
  })
	.get('/weather/:country/:city', async (req, res) => {
		const country = req.params.country;
		const city = req.params.city;
		console.info(`Got req for ${city},${country}...`);
		try {
			sendJson(res, 200, await weatherdata.getWeather(city, country));
		} catch (e) {
			sendErrorJson(res, 404, e.message);
		}
	})
  .get('/places/nearby', (req, res, next) => {
    const latitude = Number.parseFloat(req.query.lat);
    const longitude = Number.parseFloat(req.query.lon);
    const withinRadius = Number.parseFloat(req.query.radius);
    const unit = req.query.unit;
    if (latitude && longitude && withinRadius && unit) {
      placesdata.getPlacesAround(latitude, longitude, withinRadius, unit)
        .then(result => sendJson(res, 200, result))
        .catch(error => sendErrorJson(res, 404, error.message));
    } else {
      sendErrorJson(res, 400, 'use URL with query /places/nearby?lat=xxx.yyy&lon=xxx.yyy&radius=rrr^&unit=km');
    }
  })
  .get('/places/nearby/:place', (req, res, next) => {
    const latitude = Number.parseFloat(req.query.lat);
    const longitude = Number.parseFloat(req.query.lon);
    const withinRadius = Number.parseFloat(req.query.radius);
    const unit = Number.parseFloat(req.query.unit);
    if (latitude && longitude && withinRadius && unit) {
      placesdata.getPlacesAround(latitude, longitude, withinRadius, unit)
        .then(result => sendJson(res, 200, result))
        .catch(error => sendErrorJson(res, 404, error.message));
    } else if (req.params.place) {
      const place = req.params.place;
      placesdata.getPlacesNearby(place)
        .then(result => sendJson(res, 200, result))
        .catch(error => sendErrorJson(res, 404, error.message));
    } else {
      next();
    }
  })
	.get('/places', (req, res) => {
		placesdata.getAllPlaces()
      .then(result => sendJson(res, 200, result))
      .catch(error => sendErrorJson(res, 404, error.message));
	})
	.get('/simulateException', (req, res, next) => {
		const error = new Error('Oops! Something went wrong');
		console.error("Simulating Server Fail by Exception...", error);
		sendErrorJson(res, 503, error.message);
	});

const http = require('http');
const httpServer = http.createServer();

// Mount the app here
httpServer.on('request', app);

const PORT = process.env.PORT || 8000
// Let us start our server
httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }`));

exports.stop = function stop() {
	httpServer.close(() => console.log(`Shutdown server...`));
}
