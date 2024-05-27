# Nuxt 3 Full-Stack
Simple starter with Nuxt 3, PostgreSQL, and OAuth for the authentication layer.

## Stack
- [Nuxt 3](https://v3.nuxtjs.org/) deals with frontend and backend.
- [PostgreSQL](https://postgresql.org/) as a database.
- [Drizzle ORM](https://orm.drizzle.team/) as an ORM, migrator and query builder.
- [Zod](https://zod.dev/) for schema validation and type safety, both on the frontend and backend.
- [Lucia Auth](https://lucia-auth.com/) for the authentication layer.
- [Arctic](https://arctic.js.org/) for the OAuth api layer.
- [Shadcn Vue](https://www.shadcn-vue.com/) for the component library.

## Prerequisites
In order to run the project, you need:
- Node.js 18+ (20.5.0 is what I'm using to develop this project);
- PostgreSQL 13+;
- pnpm 8+;

Optional:
- Docker to run PostgreSQL via Docker Compose.

To install pnpm, you can use corepack:
```bash
corepack enable
corepack install
```

## PostgreSQL via Docker Compose
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

Startup postgresql:
```bash
docker-compose up -d
```

Run the migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

Finally, run Nuxt:
```bash
pnpm dev
```

## Setup OAuth
This project supports OAuth via Discord and Github. To set it up, you need to create an OAuth application on the respective platforms.

### Discord
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application.
3. Go to the OAuth2 section.
4. Add `http://localhost:3000/auth/discord/callback` as a redirect URL.
5. Copy the client ID and client secret to the `.env` file.

### Github
1. Go to the [Github Developer Settings/OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App.
3. Add `http://localhost:3000/auth/github/callback` as a callback URL.
4. Copy the client ID and client secret to the `.env` file.
