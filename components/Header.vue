<script lang="ts" setup>
const { user } = useUser()

async function handleLogout() {
  await $fetch('/api/logout', {
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
      <template v-for="link in navigation" :key="link.name">
        <ULink v-if="link.show" :to="link.href" active-class="text-primary">
          {{ link.name }}
        </ULink>
      </template>
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="gray"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <UButton v-if="user" icon="i-heroicons-arrow-left-on-rectangle-solid" square variant="ghost" color="red" @click="handleLogout" />
    </header>
  </div>
</template>
