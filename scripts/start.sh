#! /bin/bash

gulp build

forever stopall
NODE_ENV=production forever start ./dist/server/Server.js