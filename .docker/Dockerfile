# dev stage
FROM node:18-alpine as dev

ARG NITRO_PORT
ARG VITE_API_URL

ENV NODE_ENV=development
ENV NITRO_PORT=$NITRO_PORT
ENV VITE_API_URL=$VITE_API_URL

# Echo environment variables for verification
RUN echo "The NITRO_PORT is ${NITRO_PORT}"
RUN echo "The VITE_API_URL is ${VITE_API_URL}"

# setup workdir (next commands will run under this context, but also the running container will inherit this - if not overridden at runtime)
WORKDIR /usr/src/app/

# Needed for VS Code Remote Development
RUN apk add musl libgcc libstdc++ git curl wget bash ca-certificates gcompat openssh-client

# Build App
# - copy package.json and yarn.lock (optimise image build - copy only these files and run install, if these change rarely we can reuse this image layer too)
COPY package.json yarn.lock ./

# - install packages (optimise image build - run just install after copying package.json, we hope these will change rarer as the code, so we can reuse this image layer too)
RUN yarn install

# - copy the rest of the code (except the ones in .dockerignore) (optimise image build - we expect these to change everytime, so keep this as late as possible)
COPY . .

EXPOSE $NITRO_PORT

CMD ["yarn", "run", "dev"]

# prod (and build) stages
FROM dev AS build

ARG NITRO_PORT
ARG VITE_API_URL

ENV NITRO_PORT=$NITRO_PORT
ENV VITE_API_URL=$VITE_API_URL

RUN echo "The VITE_API_URL is ${VITE_API_URL}"

RUN yarn run build

# prod stage
FROM build AS prod

ARG NITRO_PORT
ARG VITE_API_URL

ENV NITRO_PORT=$NITRO_PORT
ENV VITE_API_URL=$VITE_API_URL

RUN echo "The VITE_API_URL is ${VITE_API_URL}"

EXPOSE $NITRO_PORT

CMD ["yarn", "run", "start"]
