# cybersecurity-flaws

A simple chat app that tries to implement as many cybersecurity flaws as possible + also some ridiculous "features".

## How to run the project

The project is a Node.js application that uses a MariaDB database. Node.js/npm installation instructions can be found [here](https://nodejs.org/en/download/).

### Install dependencies

`npm i`

### Run database in docker container (or whatever other method you prefer)

Docker install instructions can be found [here](https://docs.docker.com/get-started/get-docker/).

`docker run --name cyber-dev-db -e MARIADB_ROOT_PASSWORD=cyber-password -e MARIADB_DATABASE=cyber-db -p 3306:3306 -d mariadb:11.6.2`

### Create a .env file in the root of the project with the following content

Set the SESSION_SECRET to a random string of your choice. The DATABASE_URL should be the connection string to your database.

```
SESSION_SECRET=sessionsupersecret
DATABASE_URL=mysql://root:cyber-password@localhost:3306/cyber-db
```

### Initialize database

`npm run db:init`

### Run the project

`npm run dev`

Open the app in localhost:5000

## Flaws in the application

TODO
