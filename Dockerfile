# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Next.js"

WORKDIR /app

ENV NODE_ENV="production"

ARG NEXT_PUBLIC_SERVICE_ID
ARG NEXT_PUBLIC_TEMPLATE_ID
ARG NEXT_PUBLIC_PUBLIC_KEY

ENV NEXT_PUBLIC_SERVICE_ID=$NEXT_PUBLIC_SERVICE_ID
ENV NEXT_PUBLIC_TEMPLATE_ID=$NEXT_PUBLIC_TEMPLATE_ID
ENV NEXT_PUBLIC_PUBLIC_KEY=$NEXT_PUBLIC_PUBLIC_KEY

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY package-lock.json package.json ./
RUN npm ci --include=dev

COPY . .
RUN npx next build --experimental-build-mode compile

RUN npm prune --omit=dev

FROM base

COPY --from=build /app /app

ENTRYPOINT [ "/app/docker-entrypoint.js" ]

EXPOSE 3000
CMD [ "npm", "run", "start" ]
