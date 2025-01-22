# Use a specific Node.js version for better reproducibility
#FROM node:23.3.0-slim AS builder
# note this architecture is listed twice in this file!
#FROM node:23-bookworm-slim AS builder

FROM arm64v8/node:23-bookworm-slim AS builder
#docker pull 
RUN apt-get update
RUN apt-get install -y bash
RUN apt-get install -y curl python3 

# Install pnpm globally and install necessary build tools
RUN npm install -g pnpm@9.4.0 

# Set Python 3 as the default python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Set the working directory
WORKDIR /app

# Copy package.json and other configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./

# Copy the rest of the application code
COPY agent ./agent
COPY packages ./packages
COPY scripts ./scripts
COPY characters ./characters

# Install dependencies and build the project
RUN pnpm install \
    && pnpm build-docker \
    && pnpm prune --prod

# Create a new stage for the final image
#FROM node:23.3.0-slim
#FROM node:23-bookworm-slim
FROM h4ckermike/fastembed-js:pr-1 AS fastembed

# dont do anything to this fast embed

FROM arm64v8/node:23-bookworm-slim 

# Install runtime dependencies if needed
RUN apt-get update 
RUN apt-get install -y  bash
RUN apt-get install -y  git python3 curl
RUN apt-get clean &&  rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm@9.4.0 

WORKDIR /app

# Copy built artifacts and production dependencies from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/turbo.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=fastembed /app/node_modules/fastembed ./node_modules/fastembed
COPY --from=builder /app/agent ./agent
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/characters ./characters

# Set the command to run the application
CMD ["pnpm", "start", "--characters=characters/eliza.character.json"]
