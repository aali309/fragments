# This is a Dockerfile: it defines a set of **instructions** used by the Docker Engine to create a Docker Image. 
# This Docker Image can be used to create a running Docker Container.
# Every `Dockerfile` must begin with a [`FROM` instruction].This specifies the parent (or _base_) image to use as a 
# starting point for our own image. Our `fragments` image will be _based_ on other Docker images.

# Use node version 18.13.0
# stage 1 build-stage
FROM node:18.16.0 AS build

# Metadata about the image
  LABEL maintainer="Atif Ali <aali309@myseneca.ca>"
  LABEL description="Fragments node.js microservice"

# Environment variables
  # We default to use port 8080 in our service
  ENV PORT=8080

  # Reduce npm spam when installing within Docker
  # https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
    ENV NPM_CONFIG_LOGLEVEL=warn

  # Disable colour when run inside Docker
  # https://docs.npmjs.com/cli/v8/using-npm/config#color
    ENV NPM_CONFIG_COLOR=false
  
  # working directory
  WORKDIR /app

# Copy package.json and package-lock.json files
  COPY package*.json /app/

# Install node dependencies defined in package-lock.json
  RUN npm install

# Copy src to /app/src/
  COPY ./src ./src

# stage 2 production-stage
  FROM node:18.16.0

# Copy built files from the previous stage
  COPY --from=build /app /app

# Copy our HTPASSWD file
  COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
  CMD npm start

# We run our service on port 8080
  EXPOSE 8080



