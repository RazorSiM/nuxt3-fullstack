<script lang="ts" setup>
defineOptions({
  name: 'UserView',
})

definePageMeta({
  middleware: ['protected'],
})

const { user, loggedIn, session } = useUserSession()
const toast = useToast()

async function updateUsername(values: UserUpdateForm) {
  try {
    await $fetch(`/api/users/${user.value?.id}`, {
      method: 'PATCH',
      body: {
        username: values.username,
      },
    })
    toast.add({
      title: 'Username updated successfully',
    })
  }
  catch (error) {
    toast.add({ title: `Failed to update username: ${error}` })
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
  const response = await $fetch<ResponseSession[]>(`/api/users/${user.value?.id}/sessions`, {
    method: 'GET',
  })
  sessions.value = response
}
async function deleteSession(sessionId: string) {
  await $fetch(`/api/users/${user.value?.id}/sessions/${sessionId}`, {
    method: 'DELETE',
  })
  await getUserSessions()
}
onMounted(async () => {
  await getUserSessions()
})
</script>

<template>
  <div>
    <UCard class="mt-20 max-w-lg mx-auto min-h-96">
      <template #header>
        <p>Profile</p>
        <p>
          This is your profile, you can update your username here.
        </p>
      </template>
      <div>
        <FormUserUpdate
          v-if="loggedIn && user"
          :form-initial-values="{
            username: user?.username,
          }"
          :authenticated-user="user"
          @submit="onSubmit"
        />
      </div>
    </UCard>
    <div class="mt-10 grid grid-cols-2 gap-4">
      <SessionCard
        v-for="_session in sessions"
        :id="_session.id"
        :key="_session.id"
        class="mt-5"
        :expires-at="_session.expiresAt"
        :user-id="_session.userId"
        :is-current-session="_session.id === session.sessionToken"
        @invalidate-user-session="deleteSession"
      />
    </div>
  </div>
</template>
