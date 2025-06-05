### Before checking the task, make sure that you use NodeJS version _22.14.0_. Different version may not work properly!   
#### Before checking the task complete these prerequisites (`commands` may vary depending on your development environment):
- Install docker
- Clone the repository `git clone https://github.com/AlexShyshko/nodejs2025Q2-service.git`
- Enter the repository `cd nodejs2025Q2-service`
- Choose the correct branch `git checkout part-2`
- Build the docker prod image `docker-compose build`
- Create and run a docker container `docker-compose up -d`
- Wait for `Nest application successfully started` message in container logs (can take few minutes)
#### The application supports these predefined scripts:
- `docker ps` - list of all active containers.
- `docker system prune -a` - stops and cleans all containers and images.
- `docker builder prune --all` - removes all build cache.
- `docker system df` - shows how much space is used.
- `docker-compose stop` - stops containers.
- `docker-compose down` - stops and removes all containers.
- `npx prisma migrate dev --name init` - create prisma migration
- `docker-compose logs -f prod` - prod logs
#### The application should pass these tests:
- `npm run test`