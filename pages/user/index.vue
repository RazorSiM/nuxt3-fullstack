<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
})

const { user, authenticatedUser } = useUser()

async function handleLogout(e: Event) {
  if (!(e.target instanceof HTMLFormElement))
    return
  await $fetch('/api/logout', {
    method: 'POST',
    redirect: 'manual',
  })
  await navigateTo('/login')
}
const username = ref(authenticatedUser.value.username)
async function handleUpdateUsername() {
  try {
    const response = await $fetch('/api/user', {
      method: 'PUT',
      body: {
        username: username.value,
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

const title = ref('')
const description = ref('')

async function createTodo(payload: { title: string; description: string }) {
  const body = {
    title: payload.title,
    description: payload.description,
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
  <div class="mx-auto flex flex-col gap-2 w-fit mt-10 border-1 border-zinc-400 rounded-lg p-5">
    <p>User id: {{ authenticatedUser.userId }}</p>
    <p>Username: {{ authenticatedUser.username }}</p>
    <input v-model="username" type="text" class="ring-1 ring-zinc-400 rounded px-2 py-1 transition">
    <BaseButton color="warning" @click="handleUpdateUsername()">
      Update Username
    </BaseButton>
    <form method="post" action="/api/logout" @submit.prevent="handleLogout">
      <BaseButton color="danger" type="submit">
        Sign Out
      </BaseButton>
    </form>
  </div>
  <div class="max-w-lg mx-auto mt-30">
    <h2>New Todo</h2>
    <input v-model="title" type="text" placeholder="title" class="ring-1 ring-zinc-400 rounded px-2 py-1 transition">
    <input v-model="description" type="text" placeholder="description" class="ring-1 ring-zinc-400 rounded px-2 py-1 transition">
    <BaseButton color="primary" @click="createTodo({ title, description })">
      Add
    </BaseButton>
  </div>
  <div class="max-w-lg mx-auto mt-30">
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
