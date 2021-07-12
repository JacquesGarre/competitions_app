#!/bin/bash
cd api && symfony serve -d
cd ../front-end && ng serve --port 8081 --open