# pull official base image
FROM postgres:12.5-alpine

# run create.sql on init
ADD create.sql /docker-entrypoint-initdb.d
