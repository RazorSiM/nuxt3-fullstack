<script lang="ts" setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'

const userSignupSchemaExtended = userSignupFormSchema.extend({
  confirmPassword: z.string().min(8),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
    })
  }
}).transform((data) => {
  return {
    username: data.username,
    email: data.email,
    password: data.password,
  }
})

const formSchema = toTypedSchema(
  userSignupSchemaExtended,
)

const { meta, handleSubmit } = useForm({
  validationSchema: formSchema,
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

async function handleSignup(values: UserSignupForm) {
  try {
    const formData = new FormData()
    formData.append('username', values.username)
    formData.append('email', values.email)
    formData.append('password', values.password)

    await fetch('/auth/signup', {
      method: 'POST',
      body: formData,
    })
  }
  catch (error) {
    const errorMessage = `Failed to sign up: ${error}`
    toast.error(errorMessage)
  }
}
</script>

<template>
  <form
    class="space-y-4"
    @submit="handleSubmit(handleSignup)"
  >
    <UiFormField
      v-slot="{ componentField }"
      name="username"
    >
      <UiFormItem>
        <UiFormLabel>Username</UiFormLabel>
        <UiFormControl>
          <UiInput
            type="text"
            placeholder="aVeryFunName"
            v-bind="componentField"
          />
        </UiFormControl>
        <UiFormMessage />
      </UiFormItem>
    </UiFormField>
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
    <UiFormField
      v-slot="{ componentField }"
      name="confirmPassword"
    >
      <UiFormItem>
        <UiFormLabel>Confirm Password</UiFormLabel>
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
      Signup
    </UiButton>
  </form>
</template>
