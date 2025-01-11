###################
# BUILD FOR PRODUCTION
###################
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Set environment for production
ENV NODE_ENV=production

COPY package*.json ./

# Install app dependencies using `npm ci`
RUN npm ci

COPY . .

# Run the build command
RUN npm run build

###################
# PRODUCTION
###################
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
