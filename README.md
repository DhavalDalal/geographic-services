# geographic-services

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/), the [Heroku CLI](https://cli.heroku.com/) and, the [Redis Datastore](https://redis.io/download) installed.

```sh
$ git clone git@github.com:DhavalDalal/geographic-services.git # or clone your own fork
$ cd geographic-services
$ npm install
```

* **Weather Service** - Locally is configured to send a response after a delay of 3 seconds (on purpose)
* **Nearby Places Service** - Requires Redis to be run locally. Follow the steps below to load it with data:
  * Start the Redis Server
  
    ```sh
    $ redis-server
    ```
  * In another terminal window, start the Redis Client and check whether it connects to the server or not.
  
    ```sh
    $ redis-cli
    ```
  * In the third terminal, Run the script loadPlacesInRedis.sh
  
    ```sh
    $ ./loadPlacesInRedis.sh

    Loading places data....
    Connecting to Redis redis://localhost:6379...
    Cleaned Keys =  0
    Records in Keys =  { locations: 31, 'geo-locations': 31 }
    Result =  undefined
    *** DONE ***
    ```
  * Finally, start the geographic-services app.

    ```sh
    $ npm start
    > geographic-services@0.3.0 start /Users/dhavald/Documents/workspace/geographic-services
    > node index.js
    Connecting to Redis redis://localhost:6379...
    Connected to Redis redis://localhost:6379...
    Listening on 8000
    ```  

Your app should now be running on [localhost:8000](http://localhost:8000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

or if you already have app created on heroku, simply add remote

```
git remote add heroku git@heroku.com:project.git
git remote -v
```

or

```
heroku git:remote -a project
```


## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)