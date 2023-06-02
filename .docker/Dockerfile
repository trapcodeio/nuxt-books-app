# dev stage
FROM node:18-alpine as dev

ENV NODE_ENV development

ARG VITE_API_URL
ENV VITE_API_URL $VITE_API_URL
ENV NITRO_PORT 8080

# setup workdir (next commands will run under this context, but also the running container will inherit this - if not overriden at runtime)
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

RUN yarn run build

# prod stage
FROM build AS prod

ENV NITRO_PORT 8080


# Copy the built app to the Nginx HTML directory
#COPY --from=build /usr/src/app/dist /usr/share/nginx/html
#
#COPY .docker/files/nginx.conf /etc/nginx/conf.d/default.conf
#COPY .docker/files/entrypoint.sh /usr/share/entrypoint.sh

EXPOSE $NITRO_PORT

#ENTRYPOINT ["/usr/share/entrypoint.sh"]

# Start Nginx
CMD ["yarn", "run", "start"]