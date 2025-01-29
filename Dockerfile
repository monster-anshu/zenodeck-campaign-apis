###################
# BUILD FOR PRODUCTION
###################
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies using `npm ci`
RUN npm ci --legacy-peer-deps

COPY . .

# Run the build command
RUN npm run build

# Set environment for production
ENV NODE_ENV=production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

###################
# PRODUCTION
###################
FROM gcr.io/distroless/nodejs22-debian12 AS production

WORKDIR /usr/src/app

# Copy from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

# Start the server using the production build
CMD [ "dist/main.js" ]
