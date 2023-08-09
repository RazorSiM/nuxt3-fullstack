<script setup lang="ts">
interface ErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
}

const { data: session } = useAuth()
const { data: user, refresh: refreshUser } = useFetch('/api/user')

if (!session.value)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', message: 'User Not Found' })

const address = ref(user.value?.address)
const errorResponse = ref<ErrorResponse | null>(null)

async function handleUpdateUser() {
  try {
    await $fetch('/api/user', {
      method: 'PUT',
      body: JSON.stringify({ address: address.value }),
    })
    errorResponse.value = null
    await refreshUser()
  }
  catch (error) {
    errorResponse.value = (error as { data: ErrorResponse }).data
  }
}
</script>

<template>
  <div>
    <h1>User Page</h1>
    <p>Name {{ user?.name }}</p>
    <p>Address {{ user?.address }}</p>
    <h2>Update Address</h2>
    <input v-model="address" type="text">
    <button @click="handleUpdateUser()">
      Update User
    </button>
    <div v-if="errorResponse">
      {{ errorResponse.message }}
    </div>
  </div>
</template>
