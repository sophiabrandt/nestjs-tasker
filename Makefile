SHELL := /bin/bash

export PROJECT = nestjs-tasker

# ==============================================================================
# Development

run: up dev

up:
	docker-compose up -d db

dev:
	npm run start:dev

down:
	docker-compose down -v --remove-orphans

# Run docker stand-alone (without compose)
dbup:
	docker volume create pgdata || true
	docker container run -d --name postgres-nestjs -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -v pgdata:/var/lib/postgresql/data \
  --rm postgres:13-alpine

dbdown:
	docker stop postgres-nestjs \
		&& docker volume rm pgdata

# ==============================================================================
# Running tests

.PHONY: test
test:
	npm run test
