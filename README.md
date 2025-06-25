# Optimroute

## Requirements

-   A unix-like OS (Windows is not supported)
-   node >= v10
-   git
-   yarn (install via `npm i -g yarn`)

Also, in order to compile the route optimization C++ module on `packages/engine/core`
you must have these installed:

-   cmake
-   make
-   gcc
-   curl
-   curlpp
-   rapidjson

You can run the script `packages/engine/core/install-deps.sh` in order to install them both on MacOS and Linux.

## Building

`yarn bootstrap`

This command will install all npm dependencies, and it will also try to build the C++
route optimization module. If it cannot do the latter, it will show an error,
skipping the C++ build, but the command will succeed and everything on the app except
the route optimization operations should work.

## Rebuilding the C++ route optimization module

If you have made changes to the C++ files, you can rebuild them with
the following command:

`yarn workspace @optimroute/engine build:core`

## Running everything locally

### External service requirements

**Postgres**

The default postgres connection url is `postgres://postgres:root@localhost:5432/local` for
the local environment, but it can be set to another value by exporting the variable `DATABASE_URL`.

**Redis**

The default redis connection url is `redis://@localhost:6379/0` for the local environment,
but it can be set to another value by exporting the variable `REDIS_URL`.

### Instructions

`yarn start:dev`

This will run all APIs locally and serve the core website locally at http://localhost:3000.

## Running website locally

`yarn workspace @optimroute/website start`

This will serve the core website locally at http://localhost:3000, but the website will
use the APIs deployed at the development environment, so there is no need to run the APIs
locally.

## Docker

You can also run everything inside Docker. The only requirement in this case is to have
docker installed. The downside is that it does not allow for a proper development workflow,
as the docker image is not automatically updated on code changes.

Run the following command:

`docker-compose up -d`
