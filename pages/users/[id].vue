<script setup lang="ts">
interface ErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
}

const route = useRoute()
const { data: user, execute } = await useFetch(`/api/users/${route.params.id}`)
if (!user.value)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', message: 'User Not Found' })

const name = ref(user.value.name)
const address = ref(user.value.address)
const errorResponse = ref<ErrorResponse | null>(null)
async function handleUpdateUser() {
  try {
    await fetch(`/api/users/${route.params.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: name.value,
        address: address.value,
      }),
    })
    errorResponse.value = null
    await execute()
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
    <h2>Update</h2>
    <input v-model="name" type="text">
    <input v-model="address" type="text">
    <button @click="handleUpdateUser()">
      Update User
    </button>
    <div v-if="errorResponse">
      {{ errorResponse.message }}
    </div>
  </div>
</template>
