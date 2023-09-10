<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'

defineOptions({
  name: 'UserView',
})

definePageMeta({
  middleware: ['protected'],
})

const { user, authenticatedUser } = useUser()

const userSchema = z.object({
  username: z.string().min(3).max(20),
})
type UserSchema = z.output<typeof userSchema>

const userState = ref({
  username: user.value?.username ?? '',
})

const isUserFormValid = computed(() => {
  try {
    userSchema.parse(userState.value)
    return true
  }
  catch {
    return false
  }
})

async function handleUpdateUsername(event: FormSubmitEvent<UserSchema>) {
  try {
    const response = await $fetch('/api/user', {
      method: 'PUT',
      body: {
        username: event.data.username,
      },
    })
    user.value = { userId: response.id, ...response }
  }
  catch (error) {
    createError({
      statusCode: 500,
      statusMessage: `Failed to update username: ${error}`,
    })
  }
}
</script>

<template>
  <UCard class="mt-20 max-w-lg mx-auto">
    <template #header>
      Profile
    </template>

    <UForm :schema="userSchema" :state="userState" @submit="handleUpdateUsername">
      <div class="grid grid-cols-1 gap-5">
        <UFormGroup label="User ID" description="This is your User ID" hint="Not Editable">
          <UInput icon="i-heroicons-hashtag" :value="authenticatedUser.userId" disabled />
        </UFormGroup>
        <UFormGroup label="Email" description="This is your E-Mail" hint="Not Editable">
          <UInput icon="i-heroicons-envelope" :value="authenticatedUser.email" disabled />
        </UFormGroup>
        <UFormGroup name="username" label="Username" description="This is your username" required>
          <UInput v-model="userState.username" icon="i-heroicons-user" />
        </UFormGroup>
        <UButton :disabled="!isUserFormValid" color="green" icon="i-heroicons-pencil-square" class="w-fit" type="submit">
          Update Username
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
