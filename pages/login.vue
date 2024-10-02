<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineOptions({
  name: 'LoginView',
})

const { user } = useUser()
if (user.value)
  await navigateTo('/user') // redirect to profile page

function loginTo(provider: string) {
  window.location.href = `/auth/${provider}`
}

const logins = [
  {
    provider: 'github',
    icon: 'mdi:github',
    text: 'Sign in with Github',
  },
  {
    provider: 'discord',
    icon: 'ic:round-discord',
    text: 'Sign in with Discord',
  },
]
</script>

<template>
  <Card class="mt-20 w-fit mx-auto">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>
        Sign in with one of the following providers
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <Button
        v-for="login in logins"
        :key="login.provider"
        size="lg"
        @click="loginTo(login.provider)"
      >
        <Icon
          :name="login.icon"
        />{{ login.text }}
      </Button>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <FormAuthSignupOrLogin />
    </CardContent>
  </Card>
</template>
