<script lang="ts" setup>
const user = await useUser()
if (user.value)
  await navigateTo('/') // redirect to profile page
</script>

<template>
  <h1>Sign in</h1>
  <a href="/api/login/github">Sign in with Github</a>
  <a href="/api/login/discord">Sign in with Discord</a>
  <a href="/api/login/google">Sign in with Google</a>
</template>
