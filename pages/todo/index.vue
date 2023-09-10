<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'

defineOptions({
  name: 'TodoView',
})

definePageMeta({
  middleware: ['protected'],
})

const { authenticatedUser } = useUser()
const { data: todos, refresh } = useFetch('/api/todos', {
  method: 'GET',
})

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
const isOpen = ref(false)
</script>

<template>
  <div>
    <USlideover v-model="isOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
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
    </USlideover>

    <UCard class="mt-10">
      <template #header>
        <div class="flex justify-between items-center">
          <p>Todos</p>
          <UButton color="green" icon="i-heroicons-plus" @click="isOpen = true">
            New Todo
          </UButton>
        </div>
      </template>
      <p v-if="!todos || todos.length === 0">
        No Todos available
      </p>
      <template v-else>
        <div v-for="todo in todos" :key="todo.id" class="grid grid-cols-1 gap-2 py-2 border-b">
          <div class="flex w-full justify-between">
            <p>{{ todo.title }}</p>
            <p>{{ todo.createdAt }}</p>
          </div>
          <p>{{ todo.description }}</p>
        </div>
      </template>
    </UCard>
  </div>
</template>
