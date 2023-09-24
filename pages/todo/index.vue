<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'
import Sortable from 'sortablejs'

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

const sortableElement = ref<HTMLElement | null>(null)

async function handleMoveTodo(todoId: number, oldIndex: number, newIndex: number) {
  try {
    $fetch('/api/todos/', {
      method: 'PUT',
      body: {
        id: todoId,
        oldIndex,
        newIndex,
        userId: authenticatedUser.value.userId,
      },
    })
  }
  catch (e) {
    console.error(e)
  }
}
watch(sortableElement, () => {
  if (sortableElement.value) {
    Sortable.create(sortableElement.value, {
      animation: 150,
      async onEnd(e) {
        const newIndex = e.newIndex as number + 1
        const oldIndex = e.oldIndex as number + 1

        if (todos.value === null) {
          return false
        }
        else {
          const movedItem = todos.value.splice(oldIndex, 1)[0]
          todos.value.splice(newIndex, 0, movedItem)
          await handleMoveTodo(movedItem.id, oldIndex, newIndex)
        }
      },
    })
  }
})

const todoSchema = z.object({
  title: z.string(),
  description: z.string().optional().or(z.literal('')),
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
      <p v-if="!todos || todos.length === 0" ref="sortableElement">
        No Todos available
      </p>
      <template v-else>
        <div ref="sortableElement">
          <div v-for="todo in todos" :key="todo.id" class="grid grid-cols-1 gap-2 py-2 border-b">
            <div class="flex w-full justify-between">
              <p>{{ todo.title }}</p>
              <p>{{ todo.createdAt }}</p>
            </div>
            <p>{{ todo.description }}</p>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
