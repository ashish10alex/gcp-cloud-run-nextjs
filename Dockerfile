FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV NODE_ENV production
# Add this to ensure Next.js listens on all network interfaces
ENV HOSTNAME "0.0.0.0"
ENV NEXTAUTH_URL "https://gcp-cloud-run-nextjs-927945483375.us-central1.run.app"
ENV NEXTAUTH_SECRET "3Z+v5yYbxnf/mREdJuGfEsnfhLQaSo/BAZ1MY/lUahA="

# Start the Next.js app
CMD ["npm", "start"]
