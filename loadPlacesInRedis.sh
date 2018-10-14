#!/bin/sh

echo "Loading places data...."
node load-places-in-redis.js
echo "*** DONE ***"
