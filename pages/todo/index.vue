<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'
import Sortable from 'sortablejs'
import { format, parseISO } from 'date-fns'

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

async function handleMoveTodo(todoId: number, currentIndex: number, newIndex: number) {
  try {
    $fetch('/api/todos/', {
      method: 'PUT',
      body: {
        id: todoId,
        userId: authenticatedUser.value.userId,
        currentIndex,
        newIndex,
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
      handle: '.sortable-handler',
      async onEnd(e) {
        const newIndex = e.newIndex as number + 1
        const oldIndex = e.oldIndex as number + 1
        if (todos.value === null) {
          return false
        }
        else {
          const movedItem = todos.value.splice(oldIndex - 1, 1)[0]
          todos.value.splice(newIndex - 1, 0, movedItem)
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

const editTodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().optional().or(z.literal('')),
})
type EditTodoSchema = z.output<typeof editTodoSchema>

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

async function handleEditTodo(event: FormSubmitEvent<EditTodoSchema>) {
  const body = {
    title: event.data.title,
    completed: event.data.completed,
    description: event.data.description,
    userId: authenticatedUser.value.userId,
  }
  try {
    await $fetch(`/api/todos/${event.data.id}`, {
      method: 'PUT',
      body,
    })
    await refresh()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to edit todo: ${error}`,
    })
  }
}

const isOpen = ref(false)
const isEditOpen = ref(false)
const todoToEditState = ref({
  id: null,
  title: '',
  description: '',
  completed: false,
})
const isEditTodoFormValid = computed(() => {
  try {
    editTodoSchema.parse(todoToEditState.value)
    return true
  }
  catch {
    return false
  }
})
function openEditModal(todo: Todo) {
  isEditOpen.value = true
  todoToEditState.value = todo
}

async function handleDeleteTodo(id: number) {
  try {
    await $fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    await refresh()
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete todo: ${error}`,
    })
  }
}
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
    <USlideover v-model="isEditOpen">
      <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          Todos
        </template>
        <UForm :schema="editTodoSchema" :state="todoToEditState" @submit="handleEditTodo">
          <div class="grid grid-cols-1 gap-5">
            <UFormGroup label="Title" description="Todo Title" name="title" required>
              <UInput v-model="todoToEditState.title" />
            </UFormGroup>
            <UFormGroup name="description" label="Description" description="Todo content" required>
              <UTextarea v-model="todoToEditState.description" />
            </UFormGroup>
            <UFormGroup name="completed" description="Completed">
              <UToggle v-model="todoToEditState.completed" />
            </UFormGroup>
            <UButton :disabled="!isEditTodoFormValid" color="green" icon="i-heroicons-pencil-square" class="w-fit" type="submit">
              Edit Todo
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
        <div ref="sortableElement" class="divide-y dark:divide-gray-800">
          <div v-for="todo in todos" :key="todo.id" class="flex items-start justify-between gap-x-6 py-5">
            <UButton color="white" square variant="ghost" icon="i-heroicons-bars-3" class="sortable-handler" />
            <div class="min-w-0 flex-grow">
              <div class="flex items-center gap-x-3">
                <p class="text-sm font-semibold leading-6">
                  {{ todo.title }}
                </p>
                <UBadge :color="todo.completed === true ? 'green' : 'amber'" variant="soft" size="xs" :label="todo.completed ? 'Completed' : 'In Progress'" />
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="whitespace-nowrap">
                  Updated on <time :datetime="todo.updatedAt">{{ format(parseISO(todo.updatedAt), 'PPpp') }}</time>
                </p>
              </div>
              <p>{{ todo.description }}</p>
            </div>
            <div class="flex gap-2">
              <UButton color="primary" square size="xs" variant="ghost" icon="i-heroicons-pencil" class="w-fit" @click="openEditModal(todo)" />
              <UButton color="red" square size="xs" variant="ghost" icon="i-heroicons-trash" class="w-fit" @click="handleDeleteTodo(todo.id)" />
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>
