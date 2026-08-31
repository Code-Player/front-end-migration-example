FROM node:20-alpine AS build
WORKDIR /workspace
COPY package.json yarn.lock* turbo.json ./
COPY apps ./apps
RUN yarn install --frozen-lockfile || yarn install
ARG APP
RUN yarn turbo run build --filter=@migration/${APP}

FROM node:20-alpine
WORKDIR /app
RUN yarn global add serve@14.2.4
ARG APP
COPY --from=build /workspace/apps/${APP}/dist ./dist
CMD ["serve", "-s", "dist", "-l", "4173"]
