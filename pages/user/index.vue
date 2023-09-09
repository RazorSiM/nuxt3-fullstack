<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'

definePageMeta({
  middleware: ['protected'],
})

const { user, authenticatedUser } = useUser()

const userSchema = z.object({
  username: z.string().min(3).max(20),
})
type UserSchema = z.output<typeof userSchema>

const userState = ref({
  username: user.value?.username ?? '',
})

const isUserFormValid = computed(() => {
  try {
    userSchema.parse(userState.value)
    return true
  }
  catch {
    return false
  }
})

async function handleUpdateUsername(event: FormSubmitEvent<UserSchema>) {
  try {
    const response = await $fetch('/api/user', {
      method: 'PUT',
      body: {
        username: event.data.username,
      },
    })
    user.value = { userId: response.id, ...response }
  }
  catch (error) {
    createError({
      statusCode: 500,
      statusMessage: `Failed to update username: ${error}`,
    })
  }
}

const { data: todos, refresh } = useFetch('/api/todos')

const todoSchema = z.object({
  title: z.string().min(3).max(20),
  description: z.string().min(1),
})
type TodoSchema = z.output<typeof todoSchema>
const todoState = ref({
  title: '',
  description: '',
})
const isTodoFormValid = computed(() => {
  try {
    todoSchema.parse(todoState.value)
    return true
  }
  catch {
    return false
  }
})
async function handleCreateTodo(event: FormSubmitEvent<TodoSchema>) {
  const body = {
    title: event.data.title,
    description: event.data.description,
    userId: authenticatedUser.value.userId,
  }
  try {
    await $fetch('/api/todos', {
      method: 'POST',
      body,
    })
    await refresh()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create todo: ${error}`,
    })
  }
}
</script>

<template>
  <UCard class="mt-20 max-w-lg mx-auto">
    <template #header>
      Profile
    </template>

    <UForm :schema="userSchema" :state="userState" @submit="handleUpdateUsername">
      <div class="grid grid-cols-1 gap-5">
        <UFormGroup label="User ID" description="This is your User ID" hint="Not Editable">
          <UInput icon="i-heroicons-hashtag" :value="authenticatedUser.userId" disabled />
        </UFormGroup>
        <UFormGroup label="Email" description="This is your E-Mail" hint="Not Editable">
          <UInput icon="i-heroicons-envelope" :value="authenticatedUser.email" disabled />
        </UFormGroup>
        <UFormGroup name="username" label="Username" description="This is your username" required>
          <UInput v-model="userState.username" icon="i-heroicons-user" />
        </UFormGroup>
        <UButton :disabled="!isUserFormValid" color="green" icon="i-heroicons-pencil-square" class="w-fit" type="submit">
          Update Username
        </UButton>
      </div>
    </UForm>
  </UCard>
  <UCard class="mt-20 max-w-lg mx-auto">
    <template #header>
      Todos
    </template>
    <UForm :schema="todoSchema" :state="todoState" @submit="handleCreateTodo">
      <div class="grid grid-cols-1 gap-5">
        <UFormGroup label="Title" description="Todo Title" name="title" required>
          <UInput v-model="todoState.title" />
        </UFormGroup>
        <UFormGroup name="description" label="Description" description="Todo content" required>
          <UTextarea v-model="todoState.description" />
        </UFormGroup>
        <UButton :disabled="!isTodoFormValid" color="green" icon="i-heroicons-pencil-square" class="w-fit" type="submit">
          Add Todo
        </UButton>
      </div>
    </UForm>
  </UCard>

  <div class="max-w-lg mx-auto mt-20">
    <h1>Todos</h1>
    <p v-if="!todos || todos.length === 0">
      No Todos available
    </p>
    <ul v-else>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo }}
      </li>
    </ul>
  </div>
</template>
