#!/bin/sh
cd ../packages/website/ && NODE_OPTIONS="--max-old-space-size=8096" yarn build --prod --base-href ./ &&  cd dist/apps/ && cp -fR easyroute/* /home/proyectos/html/website