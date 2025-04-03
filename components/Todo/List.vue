<script lang="ts" setup>
import { format, parseISO } from 'date-fns'
import { useSortable } from '@vueuse/integrations/useSortable'

defineOptions({
  name: 'TodoList',
})

const props = withDefaults(defineProps<{
  todos: Todo[]
  enableControls: boolean
  enableSorting: boolean
}>(), {
  enableControls: false,
  enableSorting: false,
})

const emit = defineEmits<{
  deleteTodo: [id: number]
  moveTodo: [id: number, oldPosition: number, newPosition: number]
  openSheet: [id?: number]
}>()

const syncedTodos = computed(() => props.todos)
const refTodos = ref(unref(syncedTodos))
watch(syncedTodos, (todos) => {
  refTodos.value = todos
})

const sortableElement = ref<HTMLElement | null>(null)
useSortable(sortableElement, refTodos, {
  handle: '.sortable-handler',
  animation: 0,

  onEnd: async (e) => {
    const newIndex = e.newIndex as number
    const oldIndex = e.oldIndex as number
    if (refTodos.value === null) {
      return false
    }

    const newPosition = refTodos.value[newIndex].position
    const oldPosition = refTodos.value[oldIndex].position
    if (!newPosition || !oldPosition)
      return false

    const movedItem = refTodos.value.splice(oldIndex, 1)[0]
    refTodos.value.splice(newIndex, 0, movedItem)
    emit('moveTodo', movedItem.id, oldPosition, newPosition)
  },
})
</script>

<template>
  <UCard class="mt-10">
    <template #header>
      <div class="flex gap-4 items-center w-full justify-between">
        Todos
        <UButton
          v-if="props.enableControls"
          size="sm"
          icon="i-heroicons:plus"
          color="secondary"
          @click="emit('openSheet')"
        >
          Add
        </UButton>
      </div>
      <p>
        List of Todos
      </p>
    </template>
    <div>
      <p v-if="!props.todos || props.todos.length === 0">
        No Todos available
      </p>
      <template v-else>
        <div
          ref="sortableElement"
          class="divide-y dark:divide-muted"
        >
          <div
            v-for="todo in refTodos"
            :key="todo.id"
            class="flex items-start justify-between gap-x-6 py-5"
          >
            <UButton
              v-if="props.enableSorting"
              variant="ghost"
              size="sm"
              color="neutral"
              class="sortable-handler"
            >
              <UIcon name="i-heroicons:bars-3" />
            </UButton>
            <div class="min-w-0 flex-grow">
              <div class="flex items-center gap-x-3">
                <p class="text-sm font-semibold leading-6">
                  {{ todo.title }}
                </p>
                <UBadge
                  :color="todo.completed ? 'success' : 'warning'"
                  :variant="todo.completed === true ? 'soft' : 'outline'"
                >
                  {{ todo.completed ? 'Completed' : 'In Progress' }}
                </UBadge>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
                <p class="whitespace-nowrap">
                  Updated on <time :datetime="todo.updatedAt.toString()">{{ format(parseISO(todo.updatedAt.toString()), 'PPpp') }}</time>
                </p>
              </div>
              <p>{{ todo.description }}</p>
            </div>
            <div
              v-if="props.enableControls"
              class="flex gap-2"
            >
              <UButton
                size="sm"
                variant="subtle"
                color="warning"
                icon="heroicons:pencil"
                @click="emit('openSheet', todo.id)"
              />
              <UButton
                size="sm"
                color="error"
                variant="subtle"
                icon="i-heroicons:trash"
                @click="emit('deleteTodo', todo.id)"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </UCard>
</template>
