<script lang="ts" setup>
import { toast } from 'vue-sonner'

defineOptions({
  name: 'UserView',
})

definePageMeta({
  middleware: ['protected'],
})

const config = useRuntimeConfig()
const sessionCookie = useCookie(config.public.sessionCookieName)

const { user, authenticatedUser } = useUser()

async function updateUsername(values: UserUpdateForm) {
  try {
    const response = await $fetch(`/api/users/${authenticatedUser.value.id}`, {
      method: 'PUT',
      body: {
        username: values.username,
      },
    })
    toast.success('Username updated successfully')
    user.value = response
  }
  catch (error) {
    toast.error(`Failed to update username: ${error}`)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update username: ${error}`,
    })
  }
}

async function onSubmit(values: UserUpdateForm) {
  await updateUsername(values)
}

interface ResponseSession {
  id: string
  expiresAt: string
  userId: string
  fresh: boolean
}
const sessions = ref<ResponseSession[]>([])
async function getUserSessions() {
  const response = await $fetch<ResponseSession[]>(`/api/users/${authenticatedUser.value.id}/sessions`, {
    method: 'GET',
  })
  sessions.value = response
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

function isCurrentSession(session: ResponseSession, sessionCookie: string | null | undefined) {
  return session.id === sessionCookie
}
</script>

<template>
  <div>
    <UiCard class="mt-20 max-w-lg mx-auto min-h-96">
      <UiCardHeader>
        <UiCardTitle>Profile</UiCardTitle>
        <UiCardDescription>
          This is your profile, you can update your username here.
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <FormUserUpdate
          :form-initial-values="{
            username: authenticatedUser.username,
          }"
          :authenticated-user="authenticatedUser"
          @submit="onSubmit"
        />
      </UiCardContent>
    </UiCard>
    <div class="flex gap-5 mt-20 items-center">
      <p class="text-2xl font-bold">
        Sessions
      </p>
      <UiButton
        size="xs"
        icon="i-heroicons-plus-circle"
        @click="createUserSession"
      >
        <Icon name="heroicons:plus-circle" />
        Create Session
      </UiButton>
    </div>
    <div class="grid lg:grid-cols-3 gap-10 mt-10 sm:grid-cols-2 grid-cols-1 items-stretch">
      <SessionCard
        v-for="(session) in sessions"
        :key="session.id"
        v-bind="session"
        :is-current-session="isCurrentSession(session, sessionCookie)"
        @invalidate-user-session="invalidateUserSession"
      />
    </div>
  </div>
</template>
