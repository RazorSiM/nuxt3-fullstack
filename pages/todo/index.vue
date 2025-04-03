<script lang="ts" setup>
defineOptions({
  name: 'TodoView',
})

definePageMeta({
  middleware: ['protected'],
})

const toast = useToast()
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
    toast.add({
      title: 'Todo moved successfully',
    })
  }
  catch (error) {
    const errorMessage = `Failed to move todo: ${error}`
    toast.add({
      title: errorMessage,
    })
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
    toast.add({

      title: 'Todo created successfully',
    })
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to create todo: ${error}`
    toast.add({ title: errorMessage })
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
    toast.add({
      title: 'Todo updated successfully',
    })
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to update todo: ${error}`
    toast.add({ title: errorMessage })
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
  todoToUpdate.value = { ...todo, id: todo.id }
}

async function handleDeleteTodo(id: number) {
  try {
    await $fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })
    toast.add({
      title: 'Todo deleted successfully',
    })
    await refresh()
  }
  catch (error) {
    const errorMessage = `Failed to delete todo: ${error}`
    toast.add({ title: errorMessage })
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage,
    })
  }
}
</script>

<template>
  <div>
    <USlideover
      v-model:open="isSheetOpen"
      title="Todos"
      :description="todoToUpdate ? 'Update your Todo' : 'Create a new Todo'"
    >
      <template #body>
        <FormTodoCreate
          v-if="!todoToUpdate"
          :form-initial-values="{ completed: false, title: '', description: '' }"
          @submit="onSubmit"
        />
        <FormTodoUpdate
          v-if="todoToUpdate"
          :form-initial-values="todoToUpdate"
          @submit="onSubmit"
        />
      </template>
    </USlideover>
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
