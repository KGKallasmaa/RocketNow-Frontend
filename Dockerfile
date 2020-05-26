#Build enviorment
FROM mhart/alpine-node:14.1 AS builder
#Contact information
MAINTAINER karl.gustav1789@gmail.com
WORKDIR /app
COPY . .
RUN npm ci
RUN yarn run build
#Production evniorment
FROM mhart/alpine-node:14.1
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "3001", "-s", "."]