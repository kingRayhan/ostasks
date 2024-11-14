#---------------------------------------------------------------------
# Stage 1: Build the backend (NestJS)
#---------------------------------------------------------------------
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
# Install all dependencies, including devDependencies, to build the app
RUN npm install  
COPY backend/ .
# Build the NestJS app
RUN npm run build  

#---------------------------------------------------------------------
# Stage 2: Build the frontend (NextJS)
#---------------------------------------------------------------------
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
# Install dependencies for the Next.js app
RUN npm install  
COPY client/ .
# Build the Next.js app
RUN npm run build  

#---------------------------------------------------------------------
# Final Stage: Serve the app
#---------------------------------------------------------------------
FROM node:18-alpine AS serving-stage
WORKDIR /app

# Copy backend code and built files from backend-builder
COPY --from=backend-builder /app/backend /app/backend
COPY --from=backend-builder /app/backend/node_modules /app/backend/node_modules


# Copy frontend code and built files from client-builder
COPY --from=client-builder /app/client/.next /app/client/.next
COPY --from=client-builder /app/client/node_modules /app/client/node_modules
COPY --from=client-builder /app/client/public /app/client/public
COPY --from=client-builder /app/client/package.json /app/client/package.json


# Expose necessary ports
EXPOSE 3000 4000

# Start both apps
# CMD ["sh", "-c", "node /app/backend/dist/main.js & next start /app/client -p 3000"]
CMD ["sh", "-c", "node /app/backend/dist/main.js & npm --prefix /app/client run start"]
# CMD ["sh", "-c", "node /app/backend/dist/main.js"]
