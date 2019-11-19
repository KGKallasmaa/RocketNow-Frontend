# Dockerfile.alpine
FROM mhart/alpine-node:latest

#Contact information
MAINTAINER karl.gustav1789@gmail.com


# Setup yarn
#RUN yarn config set registry https://registry.npm.taobao.org

# Create app directory
RUN mkdir -p /usr/src/app

# Installs latest Chromium (77) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Puppeteer v1.19.0 works with Chromium 77.
RUN yarn add puppeteer@1.19.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
#USER pptruser

# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.lock
# RUN sed -i '' 's/registry.npm.taobao.org/registry.npmjs.org/g' yarn.lock
RUN cd /tmp && yarn
RUN cp -a /tmp/node_modules /usr/src/app/

# simple HTTP server
RUN yarn global add http-server

# From here we load our application's code in, therefore the previous docker
# "layer" that's been cached will be used if possible
WORKDIR /usr/src/app
COPY . /usr/src/app


RUN yarn build
# Expose port
EXPOSE 3001


CMD [ "http-server", "./build", "-g", "-p", "3001", "-P" ]