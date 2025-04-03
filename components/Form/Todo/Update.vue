<script lang="ts" setup>
import type { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
  formInitialValues: TodoUpdateForm
}>()

const emit = defineEmits<{
  submit: [values: TodoUpdateForm]
}>()

type Schema = z.output<typeof todoUpdateFormSchema>

const formDisabled = computed(() => {
  return !todoUpdateFormSchema.safeParse(state).success
})

const state = reactive<Partial<Schema>>({
  title: props.formInitialValues.title,
  description: props.formInitialValues.description,
  completed: props.formInitialValues.completed,
  id: props.formInitialValues.id,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="todoUpdateFormSchema"
    class="space-y-6"
    @submit="onSubmit"
  >
    <UFormField
      label="Title"
      name="title"
    >
      <UInput
        v-model="state.title"
        type="text"
        placeholder="Todo Title"
      />
    </UFormField>

    <UFormField
      label="Description"
      name="description"
    >
      <UInput
        v-model="state.description"
        type="text"
        placeholder="Todo Description"
      />
    </UFormField>

    <UFormField
      label="Completed"
      name="completed"
    >
      <USwitch
        v-model="state.completed"
        class="!mt-0"
      />
    </UFormField>
    <UButton
      type="submit"
      :disabled="formDisabled"
    >
      Submit
    </UButton>
  </UForm>
</template>
