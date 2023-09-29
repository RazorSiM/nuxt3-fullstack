<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types/form'
import type { Session } from 'lucia'

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
    if (!user.value) {
      throw createError({
        statusCode: 500,
        statusMessage: 'User not found',
      })
    }
    const response = await $fetch(`/api/users/${user.value.userId}`, {
      method: 'PUT',
      body: {
        username: event.data.username,
      },
    })
    user.value = { userId: user.value.userId, ...response }
  }
  catch (error) {
    createError({
      statusCode: 500,
      statusMessage: `Failed to update username: ${error}`,
    })
  }
}

const sessions = ref<Session[]>([])
async function getUserSessions() {
  if (!user.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'User not found',
    })
  }
  const response = await $fetch(`/api/users/${user.value.userId}/sessions`, {
    method: 'GET',
  }) as Session[]
  sessions.value = response
}
async function createUserSession() {
  if (!user.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'User not found',
    })
  }
  await $fetch(`/api/users/${user.value.userId}/sessions`, {
    method: 'POST',
  }) as Session
  await getUserSessions()
}

onMounted(async () => {
  await getUserSessions()
})

async function invalidateUserSession(sessionId: string) {
  if (!user.value) {
    throw createError({
      statusCode: 500,
      statusMessage: 'User not found',
    })
  }
  await $fetch(`/api/users/${user.value.userId}/sessions/${sessionId}`, {
    method: 'DELETE',
  })
  await getUserSessions()
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
  <div class="flex gap-5 mt-20">
    <p class="text-2xl font-bold">
      Sessions
    </p>
    <UButton size="xs" color="green" icon="i-heroicons-plus-circle" @click="createUserSession">
      Create Session
    </UButton>
  </div>
  <div class="grid grid-cols-3 gap-10 mt-10">
    <UCard v-for="session in sessions" :key="session.sessionId">
      <div class="w-full flex justify-end">
        <UButton color="red" size="xs" square variant="solid" icon="i-heroicons-trash" @click="invalidateUserSession(session.sessionId)" />
      </div>
      <div class="flex flex-col gap-4">
        <div>
          <p class="font-bold">
            Session ID
          </p>
          <p class="break-words">
            {{ session.sessionId }}
          </p>
        </div>
        <div>
          <p class="font-bold">
            Active Expiration
          </p>
          <p>
            {{ session.activePeriodExpiresAt }}
          </p>
        </div>
        <div>
          <p class="font-bold">
            Idle Expiration
          </p>
          <p>
            {{ session.idlePeriodExpiresAt }}
          </p>
        </div>
        <div>
          <p class="font-bold">
            State
          </p>
          <p>
            {{ session.state }}
          </p>
        </div>
        <div>
          <p class="font-bold">
            Fresh
          </p>
          <p>
            {{ session.fresh }}
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>
