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
FROM caddy:2-alpine AS runner

# Copy built assets from previous stage
COPY --from=builder /app/dist /usr/share/caddy

# Copy our Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 