[![MIT License][license-shield]][license-url]

# nestjs-tasker

> a task management tool with NestJS

## Table of Contents

- [About](#about)
  - [Motivation](#motivation)
  - [Built With](#built-with)
- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## About

**nestjs-tasker** is an example Nest.js back-end API that can manage tasks.

### Motivation

This repository serves as a learning repository to chronicle my progress from the [Udemy course: **NestJS Zero to Hero**](https://www.udemy.com/nestjs-zero-to-hero/) by Ariel Weinberger.

Original code was written by Ariel Weinberger, minor modifications by me (Sophia Brandt).

### Built With

- [NestJS](https://nestjs.com/)
- [TypeScript](http://www.typescriptlang.org/)
- [PostgreSQL using Docker](https://www.rockyourcode.com/add-a-postgres-database-with-docker-to-your-project/)

## Installation

Prerequisites:

- Node.js (>=10.13.0)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

You'll need Docker and docker-compose for the Postgres database. The database runs in a [Docker container](docker-compose.yml).

```bash
$ git clone git@github.com:sophiabrandt/nestjs-tasker.git && cd nestjs-tasker
$ docker-compose build
$ pnpm install # or `npm install`
```

If you want to use your locally installed Postgres instance, you have to configure the database in the `config` folder.

## Usage

1. Start application

```bash
$ docker-compose up -d
$ pnpm run start:dev # or npm run start:dev
```

Basic Open API is available under `http://localhost:3000/api`.

2. Register user

Register a new user under `http://localhost:3000/auth/signup`:

```bash
$ curl -d '{"username":"janedoe","password":"JaneDoe$333"}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signup
```

3. Sign in and retrieve auth token on the route `http://localhost:3000/auth/signin`:

```bash
$ TOKEN=$(curl -d '{"username":"janedoe","password":"JaneDoe$333"}' -H "Content-Type: application/json" -X POST http://localhost:3000/auth/signin | jq -r '.accessToken')
```

We use [jq](https://github.com/stedolan/jq) to parse the json response and set the auth token as a bash variable in the command line.

4. Use the `tasks` route

Example:

```bash
$ curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:3000/tasks
```

Now you can do CRUD operations on `http://localhost:3000/tasks` when you send the bearer token.

## Tests

```bash
$ pnpm run test  # or npm run test
```

## License

[MIT Licence](LICENSE)

## Credits

Copyright © 2019 Ariel Weinberger, Sophia Brandt  
[Original repository](https://github.com/arielweinberger/nestjs-course-task-management)

[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=flat-square
[license-url]: https://github.com/sophiabrandt/nestjs-tasker/blob/master/LICENSE
