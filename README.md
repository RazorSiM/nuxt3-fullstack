# Nuxt 3 Full-Stack
Simple starter with Nuxt 3, PostgreSQL, and OAuth for the authentication layer.

## Stack
- [Nuxt 3](https://v3.nuxtjs.org/) deals with frontend and backend.
- [PostgreSQL](https://postgresql.org/) as a database.
- [Drizzle ORM](https://orm.drizzle.team/) as an ORM, migrator and query builder.
- [Zod](https://zod.dev/) for schema validation and type safety, both on the frontend and backend.
- [Lucia Auth](https://lucia-auth.com/) for the authentication layer.
- [Nuxt UI](https://ui.nuxt.com/) for styling.

## Prerequisites
In order to run the project, you need:
- Node.js 18+ (20.5.0 is what I'm using to develop this project);
- PostgreSQL 13+;
- pnpm 8+;

To install pnpm, you can use corepack:
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

The project has a `docker-compose` file that you can use to run PostgreSQL in a container. To do so, you need to have Docker installed and run:
```bash
docker-compose up -d
```

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