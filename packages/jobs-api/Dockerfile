FROM node:12-alpine as build

COPY . /src
WORKDIR /src

RUN apk add git jq &&\
    yarn bootstrap &&\
    yarn isolate -w @optimroute/jobs-api -o dist &&\
    cd dist &&\
    yarn install &&\
    yarn build &&\
    yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

FROM node:10-alpine

COPY --from=build /src/dist/dist /opt/app
COPY --from=build /src/dist/node_modules /opt/app/node_modules

WORKDIR /opt/app

RUN apk add gcompat && npm install pm2 -g

ENV PORT 5000

EXPOSE 5000

ENTRYPOINT ["pm2-runtime", "src/main.js"]
