<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
})

const user = useAuthenticatedUser()

async function handleLogout(e: Event) {
  if (!(e.target instanceof HTMLFormElement))
    return
  await $fetch('/api/logout', {
    method: 'POST',
    redirect: 'manual',
  })
  await navigateTo('/login')
}
const username = ref(user.value.username)
async function handleUpdateUsername() {
  await $fetch('/api/user', {
    method: 'PUT',
    body: {
      username: username.value,
    },
  })
}
</script>

<template>
  <h1>Profile</h1>
  <p>User id: {{ user.userId }}</p>
  <p>Username: {{ user.username }}</p>
  <input v-model="username" type="text">
  <button @click="handleUpdateUsername()">
    Update Username
  </button>
  <form method="post" action="/api/logout" @submit.prevent="handleLogout">
    <input type="submit" value="Sign out">
  </form>
</template>
