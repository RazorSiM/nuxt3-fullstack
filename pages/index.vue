<script lang="ts" setup>
defineOptions({
  name: 'HomeView',
})
</script>

<template>
  <article class="max-w-xl mx-auto mt-10 px-5">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Nuxt 3 Full-Stack
    </h1>
    <p class="leading-7 [&:not(:first-child)]:mt-6">
      Simple Nuxt Hub starter with Cloudflare D1, and OAuth for the authentication layer.
    </p>
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors mt-6"
    >
      Stack
    </h2>
    <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
      <li><a href="https://v3.nuxtjs.org/">Nuxt 3</a> deals with frontend and backend.</li>
      <li><a href="https://developers.cloudflare.com/d1//">Cloudflare D1</a> as a database.</li>
      <li><a href="https://orm.drizzle.team/">Drizzle ORM</a> as an ORM, migrator and query builder.</li>
      <li><a href="https://zod.dev/">Zod</a> for schema validation and type safety, both on the frontend and backend.</li>
      <li><a href="https://lucia-auth.com/">Lucia Auth</a> for the authentication layer.</li>
      <li><a href="https://www.shadcn-vue.com/">Shadcn</a> for styles and components.</li>
      <li><a href="https://hub.nuxt.com">Nuxt Hub</a> to handle serverless deployment over Cloudflare.</li>
    </ul>
  </article>
</template>
