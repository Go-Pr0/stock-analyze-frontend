# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Accept API url at build time so Vite can replace it
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies based on lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the source code and build
COPY . ./
RUN npm run build


# ---- Production stage ----
FROM nginx:1.25-alpine AS runner

# Copy built assets from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80 by default (Railway will override with $PORT)
EXPOSE 80

# Use entrypoint script to handle environment variables
ENTRYPOINT ["/docker-entrypoint.sh"] 