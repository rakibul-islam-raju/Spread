# official image
FROM node:23-alpine as build

# set workdir
WORKDIR /app

# install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# ccopy project files
COPY . .
RUN yarn build

# use nginx to serve static files
FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
