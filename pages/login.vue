<script lang="ts" setup>
defineOptions({
  name: 'LoginView',
})
const { user } = useUser()
if (user.value)
  await navigateTo('/user') // redirect to profile page

function loginTo(provider: string) {
  window.location.href = `/login/${provider}`
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
  <UCard class="mt-20 w-fit mx-auto">
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
