FROM node:8.9-alpine as builder

ARG NODE_ENV
ENV NODE_ENV "$NODE_ENV"

RUN apk update && apk add --no-cache --virtual \
  .gyp \
  python \
  make \
  g++

COPY package.json .
COPY package-lock.json .

RUN npm config set registry https://registry.npmjs.org \
 && npm install \
 && npm ls || true

FROM node:8.9-alpine as app

RUN mkdir -p /app
WORKDIR /app

COPY --from=builder node_modules .

COPY . .

CMD ["node", "garage.mqtt.js"]
