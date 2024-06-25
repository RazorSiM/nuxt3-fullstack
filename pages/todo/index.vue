<script lang="ts" setup>
import { toast } from 'vue-sonner'

defineOptions({
  name: 'TodoView',
})

definePageMeta({
  middleware: ['protected'],
})

const { data: todos, refresh } = await useFetch('/api/todos', {
  method: 'GET',
})

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

function handleOpenSheet(id?: number) {
  if (id) {
    openUpdateTodo(id)
  }
  else {
    isSheetOpen.value = true
  }
}
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
    <TodoList
      :todos="JSON.parse(JSON.stringify(todos))"
      :enable-controls="true"
      :enable-sorting="true"
      @delete-todo="handleDeleteTodo"
      @open-sheet="handleOpenSheet"
      @move-todo="handleMoveTodo"
    />
  </div>
</template>
