FROM node:20-slim AS build

WORKDIR /app/frontend

# Copy only frontend files
COPY frontend/package.json frontend/pnpm-lock.yaml ./
COPY frontend/ .

# Install pnpm and dependencies
RUN npm install -g pnpm@9.12.1
RUN pnpm install --frozen-lockfile

# Build the frontend
RUN pnpm run build

FROM node:20-slim

WORKDIR /app

# Install serve to serve the static frontend
RUN npm install -g serve@14.2.0

# Copy built frontend from build stage
COPY --from=build /app/frontend/dist ./dist

# Set environment
ENV PORT=4173
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 4173), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["sh", "-c", "serve -s dist -l $PORT --single"]
