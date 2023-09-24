import Sortable from 'sortablejs'

export function useSortTodos<T>(el: MaybeRef<HTMLElement | null>, initialValues: Ref<T[]>) {
  const sortable = shallowRef<Sortable | null>(null)

  const sortedItems = ref(initialValues.value) as Ref<T[]>

  watch(initialValues, () => {
    sortedItems.value = unref(initialValues)
  })

  watch([el], () => {
    if (unref(el) instanceof HTMLElement) {
      sortable.value?.destroy()
      sortable.value = Sortable.create(unref(el) as HTMLElement, {
        animation: 150,
        onEnd(e) {
          const newIndex = e.newIndex ?? 0
          const oldIndex = e.oldIndex ?? 0

          const movedItem = sortedItems.value.splice(oldIndex, 1)[0]
          sortedItems.value.splice(newIndex, 0, movedItem)
        },
      })
    }
  })

  return {
    sortable,
    sortedItems,
  }
}
