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
# We also need to copy the new nginx config into this stage
COPY nginx.conf ./
RUN npm run build


# ---- Production stage ----
FROM nginx:alpine AS runner

# Copy built assets from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config to enable SPA routing and API proxy
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 