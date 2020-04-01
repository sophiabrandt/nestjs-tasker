[![MIT License][license-shield]][license-url]

# nestjs-tasker

> a task management tool with NestJS

## Table of Contents

- [About](#about)
  - [Motivation](#motivation)
  - [Built With](#built-with)
- [Installation](#installation)
- [Usage](#usage)
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

## Installation

You'll need Docker and docker-compose for the Postgres database. The database runs in a [Docker container](docker-compose.yml).

```bash
$ git clone git@github.com:sophiabrandt/nestjs-tasker.git && cd nestjs-tasker
$ docker-compose build
$ pnpm install # or `npm install`
```

If you want to use your locally installed Postgres instance, you have to configure the database in the `config` folder.

## Usage

```bash
$ docker-compose up -d
$ pnpm run start # or npm run start
```

## License

[MIT Licence](LICENCE)

## Credits

Copyright © 2019 Ariel Weinberger, Sophia Brandt  
[Original repository](https://github.com/arielweinberger/nestjs-course-task-management)

[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=flat-square
[license-url]: https://github.com/sophiabrandt/nestjs-tasker/blob/master/LICENSE
