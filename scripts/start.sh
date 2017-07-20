#! /bin/bash

gulp build

forever ../dist/server/Server.js