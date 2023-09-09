<script lang="ts" setup>
const { user } = useUser()
if (user.value)
  await navigateTo('/user') // redirect to profile page

function loginTo(provider: string) {
  window.location.href = `/api/login/${provider}`
}
const ui = {
  base: 'w-fit mx-auto',
}
const logins = [
  {
    provider: 'github',
    icon: 'i-mdi-github',
    text: 'Sign in with Github',
  },
  {
    provider: 'discord',
    icon: 'i-ic-round-discord',
    text: 'Sign in with Discord',
  },
  {
    provider: 'google',
    icon: 'i-mdi-google',
    text: 'Sign in with Google',
  },
]
</script>

<template>
  <UCard :ui="ui" class="mt-20">
    <template #header>
      Login with
    </template>
    <div class="flex flex-col gap-5 items-center justify-center mx-auto w-fit">
      <UButton
        v-for="login in logins"
        :key="login.provider"
        :icon="login.icon"
        size="lg"

        @click="loginTo(login.provider)"
      >
        {{ login.text }}
      </UButton>
    </div>
  </UCard>
</template>
