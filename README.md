# Nuxt 3 Full-Stack
Simple starter with Nuxt 3, PostgreSQL, and OAuth for the authentication layer.
Demo preview: https://nuxt3-fullstack.nuxt.dev

If you want a quick start, here's a magic button:
[![Deploy to NuxtHub](https://hub.nuxt.com/button.svg)](https://hub.nuxt.com/new?repo=razorsim/nuxt3-fullstack)

## Stack
- [Nuxt 3](https://nuxt.com/) deals with frontend and backend.
- [Nuxt Hub](https://hub.nuxt.com/) to deploy everyting on Cloudflare, serverless.
- **Cloudflare D1** (sqlite) as a database.
- [Drizzle ORM](https://orm.drizzle.team/) as an ORM, migrator and query builder.
- [Zod](https://zod.dev/) for schema validation and type safety, both on the frontend and backend.
- [Lucia Auth](https://lucia-auth.com/) for the authentication layer.
- [Arctic](https://arctic.js.org/) for the OAuth api layer.
- [Shadcn Vue](https://www.shadcn-vue.com/) for the component library.

## Prerequisites
In order to run the project, you need:
- Node.js 20+ (20.16.0 is what I'm using to develop this project);
- corepack enabled to install the required pnpm version;

To install pnpm, you can use corepack:
```bash
corepack enable
corepack install
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

You need to create a new Nuxt Hub project to be able to run this repo. To do so, you can follow the instructions on the [Nuxt Hub documentation](https://hub.nuxt.com/docs/getting-started/deploy).

After you're set up, you can deploy a preview branch and connect your local environment to the development database. You can follow the instructions on the [Nuxt Hub documentation](https://hub.nuxt.com/docs/getting-started/remote-storage#local-development).

Run the migrations:
```bash
pnpm db:generate
pnpm db:migrate
```

Finally, run Nuxt:
```bash
pnpm dev --remote=preview
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
