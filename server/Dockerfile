FROM node:8.9-alpine as builder

ARG NODE_ENV
ENV NODE_ENV "$NODE_ENV"

COPY server/package.json .
COPY server/package-lock.json .

RUN npm config set registry https://registry.npmjs.org \
 && npm install \
 && npm ls || true

RUN mkdir -p /client/{public,src}

WORKDIR /client

COPY client/package.json client/package-lock.json ./
COPY client/public ./public
COPY client/src ./src

RUN npm install && npm run build

FROM node:8.9-alpine as app

ENV PORT 80
EXPOSE 80

COPY --from=builder client/build /client/build/

RUN mkdir -p /app
WORKDIR /app

COPY --from=builder node_modules .

COPY server/ .

CMD ["node", "server.js"]
