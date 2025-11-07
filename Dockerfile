# Multi-stage build for Node.js + React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install root dependencies
RUN npm install

# Install backend dependencies
RUN npm install --prefix backend

# Install frontend dependencies
RUN npm install --prefix frontend

# Copy all source files
COPY . .

# Build frontend
RUN npm run build --prefix frontend

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install only production dependencies
RUN npm install --production
RUN npm install --production --prefix backend

# Copy built frontend from builder
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy backend source
COPY backend/src ./backend/src

# Expose port (Sevalla will provide PORT env variable)
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start", "--prefix", "backend"]

