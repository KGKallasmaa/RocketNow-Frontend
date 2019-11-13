FROM node:13-alpine AS builder

#Contact information
MAINTAINER karl.gustav1789@gmail.com

WORKDIR /app
COPY . .
RUN yarn run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .

CMD ["serve", "-p", "3001", "-s", "."]