FROM node:22-alpine

# Layer for node_modules
WORKDIR /app
COPY ./package.json ./package-lock.json /app
RUN npm ci

# Build application
COPY . /app
RUN npm run build

# Start application
ENTRYPOINT ["npm", "run", "start"]

