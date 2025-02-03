# Use a Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# Install dependencies.  Use either npm or yarn as appropriate
RUN npm install --omit=dev  # For npm
# RUN yarn install --production --ignore-optional  # For yarn

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port that Cloud Run will use (important!)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
