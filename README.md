# Nuxt 3 Full-Stack
Simple starter with Nuxt 3, PostgreSQL, and OAuth for the authentication layer.

## Stack
- [Nuxt 3](https://v3.nuxtjs.org/) deals with frontend and backend.
- [PostgreSQL](https://postgresql.org/) as a database.
- [Drizzle ORM](https://orm.drizzle.team/) as an ORM, migrator and query builder.
- [Zod](https://zod.dev/) for schema validation and type safety, both on the frontend and backend.
- [Lucia Auth](https://lucia-auth.com/) for the authentication layer.
- [Nuxt UI](https://ui.nuxt.com/) for styling.
- [Supabase](https://supabase.io/) for the db. This is optional, you can setup your own PostgreSQL instance via Docker Compose (provided).

## Prerequisites
In order to run the project, you need:
- Node.js 18+ (20.5.0 is what I'm using to develop this project);
- PostgreSQL 13+;
- pnpm 8+;

Optional:
- Docker to run Supabase or PostgreSQL via Docker Compose.

To install pnpm, you can use corepack:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Supabase
First thing first, configure the environment variables in `.env` to match your Supabase instance.

```
NUXT_POSTGRES_PASSWORD="postgres"
NUXT_POSTGRES_USER="postgres"
NUXT_POSTGRES_DATABASE="postgres"
NUXT_POSTGRES_HOST="localhost"
NUXT_POSTGRES_PORT="54322"
NUXT_AUTH_SECRET="supersecret"
```

The `package.json` file has a `supabase:start` script that you can use to run Supabase in a container. To do so, you need to have Docker installed and run:

```bash
pnpm supabase:start
```

The init files for Supabase are located in the `supabase` folder and are already committed to the repo.

## PostgreSQL via Docker Compose
If you don't want to use Supabase, you can use PostgreSQL via Docker Compose.

The project has a `docker-compose` file that you can use to run PostgreSQL in a container. To do so, you need to have Docker installed and run:

```bash
docker-compose up -d
```

Remember to fill out your .env file with the correct values.

## Getting Started

First thing you need to do is to clone the repository:
```bash
degit https://github.com/RazorSiM/nuxt3-fullstack my-project
# or
git clone https://github.com/RazorSiM/nuxt3-fullstack
```

Then, install the dependencies:
```bash
cd my-project
pnpm install
```

Configure the environment variables:
```bash
cp .env.example .env
```
And edit the `.env` file to match your environment.

Startup Supabase:
```bash
pnpm supabase:start
```
OR

Startup postgresql:
```bash
docker-compose up -d
```

Run the migrations:
```bash
pnpm db:generate
pnpm db:push
```

Finally, run Nuxt:
```bash
pnpm dev
```
