# DEV
FROM node:22-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run prisma:generate
# PROD
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
COPY --from=dev /usr/src/app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=dev /usr/src/app/tsconfig*.json ./
COPY --from=dev /usr/src/app/src ./src
COPY --from=dev /usr/src/app/prisma ./prisma/
COPY --from=dev /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=dev /usr/src/app/node_modules/@prisma ./node_modules/@prisma
EXPOSE 4000
CMD [ "npm", "run", "start:docker" ]