FROM node:23.3.0-slim AS builder

# Set working directory
WORKDIR /app

# Install Node.js 23.3.0 and required dependencies
RUN apt-get update && \
    apt-get install -y curl git python3 make g++ unzip build-essential nodejs \
      node-gyp \
      ffmpeg \
      libopus-dev \
      libcairo2-dev \
      libjpeg-dev \
      libpango1.0-dev \
      libgif-dev \
      openssl \
      libssl-dev libsecret-1-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install bun using npm (more reliable across architectures)
RUN npm install -g bun turbo@2.3.3

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

FROM builder as installer 

# Copy package files
COPY .npmrc .
COPY package.json .
COPY turbo.json .
COPY tsconfig.json .
COPY lerna.json .
COPY renovate.json .
COPY scripts ./scripts
# Copy source code
COPY packages ./packages


# Install dependencies
RUN bun install

# Build the project
RUN bun run build

# Create a new stage for the final image
FROM builder

WORKDIR /app

# Install Node.js 23.3.0 and required dependencies
RUN apt-get update && \
    apt-get install -y curl git python3 make g++ unzip build-essential nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install bun using npm
RUN npm install -g bun turbo@2.3.3

# Copy built artifacts and production dependencies from the installer stage
COPY --from=installer /app/package.json ./
COPY --from=installer /app/tsconfig.json ./
COPY --from=installer /app/turbo.json ./
COPY --from=installer /app/lerna.json ./
COPY --from=installer /app/renovate.json ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/scripts ./scripts

# Set environment variables
ENV NODE_ENV=production

# Expose any necessary ports (if needed)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"] 
