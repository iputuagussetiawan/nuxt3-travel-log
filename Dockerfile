# Stage 1: Build the Nuxt 3 application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the Nuxt 3 application
RUN pnpm build

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine AS runner

# Copy the built application from the builder stage
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
