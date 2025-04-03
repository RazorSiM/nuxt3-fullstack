<script lang="ts" setup>
defineOptions({
  name: 'LoginView',
})
const { user } = useUserSession()
if (user.value)
  await navigateTo('/user') // redirect to profile page

function loginTo(provider: string) {
  window.location.href = `/api/auth/${provider}`
}

const logins = [
  {
    provider: 'github',
    icon: 'i-mdi:github',
    text: 'Sign in with Github',
  },
  {
    provider: 'discord',
    icon: 'i-ic:round-discord',
    text: 'Sign in with Discord',
  },
]
</script>

<template>
  <UCard class="mt-20 w-fit mx-auto">
    <template #header>
      <p>Login</p>
      <p>
        Sign in with one of the following providers
      </p>
    </template>
    <div class="grid gap-4">
      <UButton
        v-for="login in logins"
        :key="login.provider"
        size="lg"
        :icon="login.icon"
        variant="subtle"
        color="neutral"
        @click="loginTo(login.provider)"
      >
        {{ login.text }}
      </UButton>
    </div>
  </UCard>
</template>
