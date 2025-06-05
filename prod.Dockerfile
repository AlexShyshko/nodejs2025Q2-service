# DEVELOPMENT
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE 4000
# BUILD
FROM dev AS build
RUN npm run build
# PRODUCTION
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/.env ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["npm", "run", "start:prod"]