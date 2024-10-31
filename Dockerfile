# Stage 1: Build React application
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Install required system packages
RUN apk add --no-cache \
    openssh-client \
    openssl \
    netcat-openbsd \
    python3 \
    make \
    g++

# Create necessary directories
RUN mkdir -p /app/ssh-keys /app/logs && \
    chmod 700 /app/ssh-keys && \
    chmod 755 /app/logs

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application files
COPY --from=build /app/server.js .
COPY --from=build /app/database.js .
COPY --from=build /app/src/server ./src/server
COPY --from=build /app/dist ./dist

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

VOLUME ["/app/ssh-keys", "/app/logs"]

ENV NODE_ENV=production \
    PORT=3001 \
    DB_PORT=3306

CMD ["node", "server.js"]