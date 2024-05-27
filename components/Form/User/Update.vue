<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
  formInitialValues: UserUpdateForm
  authenticatedUser: User
}>()

const emit = defineEmits<{
  submit: [values: UserUpdateForm]
}>()

const formSchema = toTypedSchema(userUpdateFormSchema)

const { meta, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: props.formInitialValues,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form
    class="space-y-6"
    @submit="onSubmit"
  >
    <UiFormField name="userid">
      <UiFormItem>
        <UiFormLabel>User ID</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="user id"
            :default-value="authenticatedUser.id"
            :disabled="true"
          />
        </UiFormControl>
      </UiFormItem>
    </UiFormField>
    <UiFormField name="email">
      <UiFormItem>
        <UiFormLabel>E-Mail</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="email"
            :default-value="authenticatedUser.email"
            :disabled="true"
          />
        </UiFormControl>
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="username"
    >
      <UiFormItem>
        <UiFormLabel>Username</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="Username"
            v-bind="componentField"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiButton
      type="submit"
      :disabled="!meta.valid"
    >
      Submit
    </UiButton>
  </form>
</template>
