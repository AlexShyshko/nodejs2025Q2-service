# DEVELOPMENT
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
# BUILD
FROM dev AS build
RUN npm run build
# PRODUCTION
FROM node:22-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# COPY --from=dev /app/.env ./
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["npm", "run", "start:prod"]