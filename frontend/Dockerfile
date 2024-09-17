FROM node:22-alpine AS build

# Layer for node_modules
WORKDIR /app
COPY ./package.json ./package-lock.json /app
RUN npm ci

# Build application
COPY . /app
RUN npm run build

# Serve via Nginx
FROM nginx:1.26.2-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

