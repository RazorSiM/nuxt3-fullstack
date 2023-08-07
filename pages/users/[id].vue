<script setup lang="ts">
const route = useRoute()
const { data: user } = await useFetch(`/api/users/${route.params.id}`)
</script>

<template>
  <div>
    <h1>User Page</h1>
    <pre>{{ user }}</pre>
  </div>
</template>
