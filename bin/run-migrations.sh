#!/bin/sh

Wait until PostgreSQL is ready
until pg_isready -h $NUXT_POSTGRES_HOST -p $NUXT_POSTGRES_PORT -U $NUXT_POSTGRES_USER; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Run migrations
pnpm run db:migrate
