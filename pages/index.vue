<script lang="ts" setup>
defineOptions({
  name: 'HomeView',
})
</script>

<template>
  <article class="text-lg mx-auto prose prose-neutral dark:prose-invert">
    <h1 id="nuxt-3-full-stack">
      Nuxt 3 Full-Stack
    </h1>
    <p>Simple starter with Nuxt 3, PostgreSQL, and OAuth for the authentication layer.</p>
    <h2 id="stack">
      Stack
    </h2>
    <ul>
      <li><a href="https://v3.nuxtjs.org/">Nuxt 3</a> deals with frontend and backend.</li>
      <li><a href="https://postgresql.org/">PostgreSQL</a> as a database.</li>
      <li><a href="https://orm.drizzle.team/">Drizzle ORM</a> as an ORM, migrator and query builder.</li>
      <li><a href="https://zod.dev/">Zod</a> for schema validation and type safety, both on the frontend and backend.</li>
      <li><a href="https://lucia-auth.com/">Lucia Auth</a> for the authentication layer.</li>
      <li><a href="https://ui.nuxt.com/">Nuxt UI</a> for styles and components.</li>
    </ul>
  </article>
</template>
