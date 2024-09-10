# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the app.
RUN npm run build

# # Install serve to serve the build
# RUN npm install -g serve

# # Expose the port the app runs on.
# EXPOSE 5000

# # Run the web service on container startup.
# CMD ["serve", "-s", "build"]

# Use nginx to serve the built app
FROM nginx:alpine
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]