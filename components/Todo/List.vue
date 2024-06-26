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

const todos = ref(props.todos)

const sortableElement = ref<HTMLElement | null>(null)
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
    emit('moveTodo', Number.parseInt(movedItem.id), oldPosition, newPosition)
  },
})
</script>

<template>
  <UiCard class="mt-10">
    <UiCardHeader>
      <UiCardTitle class="flex gap-4 items-center w-full justify-between">
        Todos
        <UiButton
          v-if="props.enableControls"
          size="sm"
          variant="secondary"
          @click="emit('openSheet')"
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
      <p v-if="!props.todos || props.todos.length === 0">
        No Todos available
      </p>
      <template v-else>
        <div
          ref="sortableElement"
          class="divide-y dark:divide-muted"
        >
          <div
            v-for="todo in props.todos"
            :key="todo.id"
            class="flex items-start justify-between gap-x-6 py-5"
          >
            <UiButton
              v-if="props.enableSorting"
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
                <UiBadge :variant="todo.completed === true ? 'secondary' : 'outline'">
                  {{ todo.completed ? 'Completed' : 'In Progress' }}
                </UiBadge>
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
              <UiButton
                size="icon"
                variant="ghost"
                @click="emit('openSheet', Number.parseInt(todo.id))"
              >
                <Icon
                  name="heroicons:pencil"
                  size="1rem"
                />
              </UiButton>
              <UiButton
                size="icon"
                variant="destructive"
                @click="emit('deleteTodo', Number.parseInt(todo.id))"
              >
                <Icon name="heroicons:trash" />
              </UiButton>
            </div>
          </div>
        </div>
      </template>
    </UiCardContent>
  </UiCard>
</template>
