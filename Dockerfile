FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies and curl for debugging
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose NestJS port
EXPOSE 3000

# Environment variables will be provided via .env or container runtime
CMD [ "npm", "start" ]
