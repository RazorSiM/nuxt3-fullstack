<script lang="ts" setup>
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const navigation = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'User',
    href: '/user',
  },
  {
    name: 'Login',
    href: '/login',
  },
]
</script>

<template>
  <div class="flex items-center justify-between px-4 py-2">
    <header class="p-3 max-w-lg mx-auto flex gap-4 justify-center font-bold">
      <ULink v-for="link in navigation" :key="link.name" :to="link.href" active-class="text-primary">
        {{ link.name }}
      </ULink>
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
    </header>
  </div>
</template>
