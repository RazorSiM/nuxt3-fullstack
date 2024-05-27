<script lang="ts" setup>
import { Button } from '@/components/ui/button'

const { user } = useUser()

async function handleLogout() {
  await $fetch('/logout', {
    method: 'POST',
    redirect: 'manual',
  })
  await navigateTo('/login')
}

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const navigation = computed(() => {
  return [
    {
      name: 'Home',
      href: '/',
      show: true,
    },
    {
      name: 'User',
      href: '/user',
      show: !!user.value,
    },
    {
      name: 'Todos',
      href: '/todo',
      show: !!user.value,
    },
    {
      name: 'Login',
      href: '/login',
      show: !user.value,
    },
  ]
})
</script>

<template>
  <div class="">
    <header class="p-3 max-w-lg mx-auto flex gap-4 justify-center items-center font-bold">
      <template
        v-for="link in navigation"
        :key="link.name"
      >
        <Button
          v-if="link.show"
          variant="link"
        >
          <NuxtLink
            :to="link.href"
            active-class="text-violet-500"
          >

            {{ link.name }}
          </NuxtLink>
        </Button>
      </template>
      <ClientOnly>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        >
          <Icon
            :name="isDark ? 'heroicons:moon-20-solid' : 'heroicons:sun-20-solid'"
          />
        </Button>
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <Button
        v-if="user"
        size="icon"
        variant="destructive"
        @click="handleLogout"
      >
        <Icon
          name="heroicons:arrow-left-on-rectangle-solid"
        />
      </Button>
    </header>
  </div>
</template>
