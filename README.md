### Before checking the task, make sure that you use NodeJS version _22.14.0_. Different version may not work properly!   
#### Before checking the task complete these prerequisites (`commands` may vary depending on your development environment):
- Install and run docker desktop [Mac](https://docs.docker.com/desktop/setup/install/mac-install/), [Windows](https://docs.docker.com/desktop/setup/install/windows-install/), [Linux](https://docs.docker.com/desktop/setup/install/linux/) 
- Clone the repository `git clone https://github.com/AlexShyshko/nodejs2025Q2-service.git`
- Enter the repository `cd nodejs2025Q2-service`
- Choose the correct branch `git checkout part-2`
- Install dependencies `npm install`
- Generate prisma `npm run prisma:generate`
- Build images and run containers `docker-compose up -d --build`
- Wait for `Nest application successfully started` and `Swagger is available` messages in container logs (can take few minutes)
- Login docker to be able to scan vulnerabilities `docker login`
#### The application should pass these tests:
- `npm run test:auth`
- `npm run test:refresh`
#### Swagger is available:
- [http://localhost:4000/doc](http://localhost:4000/doc)
#### The application supports these predefined scripts:
- `npm run scan:docker-db` - database vulnerabilities scanning.
- `npm run scan:docker-prod` - API vulnerabilities scanning.
- `docker system prune -a` - stops and cleans all containers and images.
- `docker ps` - list of all active containers.
- `docker system df` - shows how much space is used.
- `docker-compose stop` - stops containers.
- `docker-compose down` - stops and removes all containers.
- `docker-compose logs -f prod` - prod logs.
#### To make migration:
- Temporarily update .env for local DB - `DATABASE_URL="postgresql://kuroluboff:qwerty@localhost:3999/home-library?schema=public"`
- Start the database locally via Docker Compose - `docker-compose up -d db`
- Run the migration locally - `npx prisma migrate dev`
- Revert .env - `DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_DOCKER_COMPOSE_SERVICE_NAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"`
- Generate prisma `npm run prisma:generate`