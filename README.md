# Crowded Assessment - Project Setup

## Prerequisites

Before starting the project, ensure you have the following installed:

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (Recommended: v18+)
- `npm` or `yarn`
- [Sequelize CLI](https://sequelize.org/master/manual/migrations.html) (installed globally if you want to run migration commands manually)

## Installation & Setup

### Clone the repository

```sh
git clone https://github.com/beito/crowded-assessment.git
cd crowded-assessment
```

### Install dependencies

```sh
npm install
```

## Running the Project with Docker

### Start the database

```sh
docker-compose up -d
```

This will run MySQL inside a container with the configuration defined in `docker-compose.yml`.

### Start the server

```sh
npm run start:dev
```

### In other terminal, Run the seeders (You could stop the server and running it again)

```sh
npx sequelize-cli db:seed:all
```

This will populate the database with initial data for users and services.

The server will be available at:

[http://localhost:3000](http://localhost:3000)

## Running Unit Tests

To verify that all backend functionalities work correctly, run:

```sh
npm run test
```

This will display code coverage and test results.

To run tests in watch mode:

```sh
npm run test:watch
```

## API Usage

You can test the API endpoints using `curl`, Postman, or any API client.

### Authentication (POST)

**
http://localhost:3000/auth/login
**

**Expected response:**
```json
{
  "access_token": "eyJhbGciOiJI..."
}
```

### Create an Installment (POST)

**
http://localhost:3000/installments
**

### Make a Payment (POST)

**
http://localhost:3000/payments
**

### Check all Installment (GET)

**
http://localhost:3000/installments
**

## Ready to go!

Now you can use the API without issues.
