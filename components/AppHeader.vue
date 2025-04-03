<script lang="ts" setup>
const { user, clear, loggedIn } = useUserSession()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

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
        <UButton
          v-if="link.show"
          variant="link"
          color="neutral"
        >
          <NuxtLink
            :to="link.href"
            active-class="text-violet-500"
          >

            {{ link.name }}
          </NuxtLink>
        </UButton>
      </template>
      <ClientOnly>
        <UButton
          size="sm"
          variant="ghost"
          aria-label="Theme"
          :icon="isDark ? 'i-heroicons:moon-20-solid' : 'i-heroicons:sun-20-solid'"
          color="neutral"
          @click="isDark = !isDark"
        />
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
      <UButton
        v-if="loggedIn"
        size="sm"
        color="error"
        variant="subtle"
        icon="i-heroicons:arrow-left-on-rectangle-solid"
        @click="clear"
      />
    </header>
  </div>
</template>
