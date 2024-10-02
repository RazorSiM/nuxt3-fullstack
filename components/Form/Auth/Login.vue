<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'

const formSchema = toTypedSchema(
  userLoginFormSchema,
)

const { meta, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

async function handlePasswordLogin(values: UserLoginForm) {
  try {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    await $fetch('/auth/login', {
      method: 'POST',
      body: formData,
    })
  }
  catch (error) {
    const errorMessage = `Failed to login: ${error}`
    toast.error(errorMessage)
  }
}
</script>

<template>
  <form
    class="space-y-4"
    @submit="handleSubmit(handlePasswordLogin)"
  >
    <UiFormField
      v-slot="{ componentField }"
      name="email"
    >
      <UiFormItem>
        <UiFormLabel>Email</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="example@domain.fun"
            v-bind="componentField"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiFormField
      v-slot="{ componentField }"
      name="password"
    >
      <UiFormItem>
        <UiFormLabel>Password</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="password"
            placeholder="averysecurepassword"
            v-bind="componentField"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
    <UiButton
      type="submit"
      size="xs"
      :disabled="!meta.valid"
    >
      Login
    </UiButton>
  </form>
</template>
