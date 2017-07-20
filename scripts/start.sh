#! /bin/bash

gulp build

NODE_ENV=production forever start ../dist/server/Server.js