<script lang="ts" setup>
import type { User } from '@/database/users/schema'

interface ErrorResponse {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  stack: string
}

const name = ref('')
const address = ref('0x')
const userData = ref<User | null>(null)
const errorResponse = ref<ErrorResponse | null>(null)
async function createUser() {
  try {
    const response = await $fetch('/api/users', {
      method: 'POST',
      body: {
        name: name.value,
        address: address.value,
      },
    })
    errorResponse.value = null
    userData.value = response
  }
  catch (error) {
    errorResponse.value = (error as { data: ErrorResponse }).data
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1>Create User</h1>
    <input v-model="name" type="text">
    <input v-model="address" type="text">
    <button :disabled="!name || !address" @click="createUser()">
      Create User
    </button>
    <div v-if="errorResponse">
      {{ errorResponse.message }}
    </div>
    <div v-if="userData">
      <p>User created successfully:</p>
      <p>Name: {{ userData.name }}</p>
      <p>Address: {{ userData.address }}</p>
      {{ userData }}
    </div>
  </div>
</template>
