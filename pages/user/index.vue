<script lang="ts" setup>
import { toast } from 'vue-sonner'

defineOptions({
  name: 'UserView',
})

definePageMeta({
  middleware: ['protected'],
})

const { user, loggedIn } = useUserSession()

async function updateUsername(values: UserUpdateForm) {
  try {
    await $fetch(`/api/users/${user.value?.id}`, {
      method: 'PUT',
      body: {
        username: values.username,
      },
    })
    toast.success('Username updated successfully')
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
  const response = await $fetch<ResponseSession[]>(`/api/users/${user.value?.id}/sessions`, {
    method: 'GET',
  })
  sessions.value = response
}

onMounted(async () => {
  await getUserSessions()
})
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
          v-if="loggedIn && user"
          :form-initial-values="{
            username: user?.username,
          }"
          :authenticated-user="user"
          @submit="onSubmit"
        />
      </UiCardContent>
    </UiCard>
  </div>
</template>
