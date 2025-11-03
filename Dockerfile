# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js"

# Next.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# ────────────────────────────────
# EMAILJS: Accept build args (for client-side)
# ────────────────────────────────
ARG NEXT_PUBLIC_SERVICE_ID
ARG NEXT_PUBLIC_TEMPLATE_ID
ARG NEXT_PUBLIC_PUBLIC_KEY

# Set them as ENV so Next.js sees them during build
ENV NEXT_PUBLIC_SERVICE_ID=$NEXT_PUBLIC_SERVICE_ID
ENV NEXT_PUBLIC_TEMPLATE_ID=$NEXT_PUBLIC_TEMPLATE_ID
ENV NEXT_PUBLIC_PUBLIC_KEY=$NEXT_PUBLIC_PUBLIC_KEY

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy application code
COPY . .

# Build application
RUN npx next build --experimental-build-mode compile

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Entrypoint sets up the container.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default
EXPOSE 3000
CMD [ "npm", "run", "start" ]
