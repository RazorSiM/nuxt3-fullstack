<script setup lang="ts">
const route = useRoute()
const { data: user } = await useFetch(`/api/users/${route.params.id}`)
if (!user.value)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', message: 'User Not Found' })
</script>

<template>
  <div>
    <h1>User Page</h1>
    <pre>{{ user }}</pre>
  </div>
</template>
