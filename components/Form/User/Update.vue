<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui'
import type { z } from 'zod'

const props = defineProps<{
  formInitialValues: UserUpdateForm
  authenticatedUser: User
}>()

const emit = defineEmits<{
  submit: [values: UserUpdateForm]
}>()

type Schema = z.output<typeof userUpdateFormSchema>

const state = reactive<Partial<Schema>>({
  username: props.formInitialValues.username,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('submit', event.data)
}

const formDisabled = computed(() => {
  return !userUpdateFormSchema.safeParse(state).success
})
</script>

<template>
  <UForm
    :schema="userUpdateFormSchema"
    :state="state"
    class="space-y-6"
    @submit="onSubmit"
  >
    <UFormField
      label="User ID"
      name="userid"
    >
      <UInput
        :value="authenticatedUser.id"
        disabled
      />
    </UFormField>
    <UFormField
      label="E-Mail"
      name="email"
    >
      <UInput
        :value="authenticatedUser.email"
        disabled
      />
    </UFormField>
    <UFormField
      name="username"
      label="Username"
    >
      <UInput
        v-model="state.username"
        type="text"
        placeholder="Username"
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
