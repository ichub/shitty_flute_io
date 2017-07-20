#! /bin/bash

gulp build

NODE_ENV=production forever ../dist/server/Server.js