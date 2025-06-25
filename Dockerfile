FROM node:10-alpine

COPY . /src
WORKDIR /src

RUN apk add git && yarn bootstrap