<script lang="ts" setup>
import { format, parseISO } from 'date-fns'
import { useSortable } from '@vueuse/integrations/useSortable'
import { toast } from 'vue-sonner'

defineOptions({
  name: 'TodoView',
})

definePageMeta({
  middleware: ['protected'],
})

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
        currentIndex,
        newIndex,
      },
    })
    toast.success('Todo moved successfully')
  }
  catch (error) {
    const errorMessage = `Failed to move todo: ${error}`
    toast.error(errorMessage)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
}

// @ts-expect-error - This error is about the todos type being wrapped in a SerializeObject type
useSortable(sortableElement, todos, {
  handle: '.sortable-handler',
  animation: 0,

  onEnd: async (e) => {
    const newIndex = e.newIndex as number
    const oldIndex = e.oldIndex as number
    if (todos.value === null) {
      return false
    }

    const newPosition = todos.value[newIndex].position
    const oldPosition = todos.value[oldIndex].position
    if (!newPosition || !oldPosition)
      return false

    const movedItem = todos.value.splice(oldIndex, 1)[0]
    todos.value.splice(newIndex, 0, movedItem)
    await handleMoveTodo(movedItem.id, oldPosition, newPosition)
  },
})

async function handleCreateTodo(values: TodoCreateForm) {
  const body = {
    title: values.title,
    description: values.description,
    completed: values.completed,
  }
  try {
    await $fetch('/api/todos', {
      method: 'POST',
      body,
    })
    toast.success('Todo created successfully')
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to create todo: ${error}`
    toast.error(errorMessage)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
}

async function handleUpdateTodo(values: TodoUpdateForm) {
  const body = {
    title: values.title,
    completed: values.completed,
    description: values.description,
  }
  try {
    await $fetch(`/api/todos/${values.id}`, {
      method: 'PUT',
      body,
    })
    toast.success('Todo updated successfully')
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to update todo: ${error}`
    toast.error(errorMessage)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
}

const isSheetOpen = ref(false)

async function onSubmit(values: TodoUpdateForm | TodoCreateForm) {
  isSheetOpen.value = false
  if (isTodoUpdateForm(values)) {
    await handleUpdateTodo(values)
  }
  else {
    await handleCreateTodo(values)
  }
}

const todoToUpdate = ref<TodoUpdateForm | null>(null)
const todoFormInitialValues = computed(() => {
  if (todoToUpdate.value !== null) {
    return todoToUpdate.value
  }
  else {
    return {
      title: '',
      description: '',
      completed: false,
    }
  }
})

watchDebounced(isSheetOpen, () => {
  if (!isSheetOpen.value) {
    todoToUpdate.value = null
  }
}, { debounce: 500 })

function openUpdateTodo(id: number) {
  const todo = todos.value?.find(todo => todo.id === id)
  if (!todo)
    return
  isSheetOpen.value = true
  todoToUpdate.value = todo
}

async function handleDeleteTodo(id: number) {
  try {
    await $fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    toast.success('Todo deleted successfully')
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to delete todo: ${error}`
    toast.error(errorMessage)
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
}
</script>

<template>
  <div>
    <UiSheet v-model:open="isSheetOpen">
      <UiSheetContent>
        <UiSheetHeader>
          <UiSheetTitle>Todos</UiSheetTitle>
          <UiSheetDescription>{{ todoToUpdate ? 'Update your Todo' : "Create a new Todo" }}</UiSheetDescription>
        </UiSheetHeader>
        <FormTodoCreateOrUpdate
          :form-initial-values="todoFormInitialValues"
          @submit="onSubmit"
        />
      </UiSheetContent>
    </UiSheet>
    <UiCard class="mt-10">
      <UiCardHeader>
        <UiCardTitle class="flex gap-4 items-center w-full justify-between">
          Todos
          <UiButton
            size="sm"
            variant="secondary"
            @click="isSheetOpen = true"
          >
            <Icon name="heroicons:plus" />
            Add
          </UiButton>
        </UiCardTitle>
        <UiCardDescription>
          List of Todos
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <p
          v-if="!todos || todos.length === 0"
          ref="sortableElement"
        >
          No Todos available
        </p>
        <template v-else>
          <div
            ref="sortableElement"
            class="divide-y dark:divide-muted"
          >
            <div
              v-for="todo in todos"
              :key="todo.id"
              class="flex items-start justify-between gap-x-6 py-5"
            >
              <UiButton
                variant="ghost"
                size="icon"
                class="sortable-handler"
              >
                <Icon name="heroicons:bars-3" />
              </UiButton>
              <div class="min-w-0 flex-grow">
                <div class="flex items-center gap-x-3">
                  <p class="text-sm font-semibold leading-6">
                    {{ todo.title }}
                  </p>
                  <UiBadge
                    :variant="todo.completed === true ? 'secondary' : 'outline'"
                  >
                    {{ todo.completed ? 'Completed' : 'In Progress' }}
                  </UiBadge>
                </div>
                <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
                  <p class="whitespace-nowrap">
                    Updated on <time :datetime="todo.updatedAt">{{ format(parseISO(todo.updatedAt), 'PPpp') }}</time>
                  </p>
                </div>
                <p>{{ todo.description }}</p>
              </div>
              <div class="flex gap-2">
                <UiButton
                  size="icon"
                  variant="ghost"
                  @click="openUpdateTodo(todo.id)"
                >
                  <Icon
                    name="heroicons:pencil"
                    size="1rem"
                  />
                </UiButton>
                <UiButton
                  size="icon"
                  variant="destructive"
                  @click="handleDeleteTodo(todo.id)"
                >
                  <Icon name="heroicons:trash" />
                </UiButton>
              </div>
            </div>
          </div>
        </template>
      </UiCardContent>
    </UiCard>
  </div>
</template>
