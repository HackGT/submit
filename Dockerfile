# Build container
FROM node:12-alpine AS build

WORKDIR /usr/src/submit/client
COPY ./client/ /usr/src/submit/client/
RUN yarn install && yarn run build

# Runtime container
FROM node:12-alpine

WORKDIR /usr/src/submit
COPY ./server/ /usr/src/submit/server/
COPY --from=build /usr/src/submit/client/ /usr/src/submit/client

EXPOSE 3000

WORKDIR /usr/src/submit/server
RUN yarn install

CMD ["yarn", "run", "start"]