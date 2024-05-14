<script lang="ts" setup>
import { z } from 'zod'
import type { Session } from 'lucia'
import type { FormSubmitEvent } from '#ui/types'

defineOptions({
  name: 'UserView',
})

definePageMeta({
  middleware: ['protected'],
})
const config = useRuntimeConfig()
const sessionCookie = useCookie(config.public.sessionCookieName)

const { user, authenticatedUser } = useUser()

const userSchema = z.object({
  username: z.string().min(3).max(20),
})
type UserSchema = z.output<typeof userSchema>

const userState = ref({
  username: authenticatedUser.value.username,
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
    const response = await $fetch(`/api/users/${authenticatedUser.value.id}`, {
      method: 'PUT',
      body: {
        username: event.data.username,
      },
    }) as User
    user.value = { ...response }
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
  const response = await $fetch(`/api/users/${authenticatedUser.value.id}/sessions`, {
    method: 'GET',
  })
  sessions.value = response as Session[]
}
async function createUserSession() {
  await $fetch(`/api/users/${authenticatedUser.value.id}/sessions`, {
    method: 'POST',
  })
  await getUserSessions()
}

onMounted(async () => {
  await getUserSessions()
})

async function invalidateUserSession(sessionId: string) {
  await $fetch(`/api/users/${authenticatedUser.value.id}/sessions/${sessionId}`, {
    method: 'DELETE',
  })
  await getUserSessions()
}

function isCurrentSession(session: Session, sessionCookie: string | null | undefined) {
  return session.id === sessionCookie
}
function cardClasses(session: Session, sessionCookie: string | null | undefined) {
  if (isCurrentSession(session, sessionCookie)) {
    return {
      ring: 'ring-green-200 dark:ring-green-200',
    }
  }
  return {}
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
          <UInput icon="i-heroicons-hashtag" :value="authenticatedUser.id" disabled />
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
    <UCard v-for="(session) in sessions" :key="session.id" :ui="cardClasses(session, sessionCookie)">
      <template #header>
        <div class="flex items-center justify-between">
          <p>{{ isCurrentSession(session, sessionCookie) ? 'Current Session' : 'Api Session' }}</p>
          <UButton :disabled="isCurrentSession(session, sessionCookie)" color="red" size="xs" square variant="solid" icon="i-heroicons-trash" @click="invalidateUserSession(session.id)" />
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <div>
          <p class="font-bold">
            Session ID
          </p>
          <p class="break-words">
            {{ session.id }}
          </p>
        </div>
        <div>
          <p class="font-bold">
            Active Expiration
          </p>
          <p>
            {{ session.expiresAt }}
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
