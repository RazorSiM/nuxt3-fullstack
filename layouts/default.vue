<script lang="ts" setup>
</script>

<template>
  <div class="dark:bg-neutral-950 bg-neutral-100 h-screen w-screen overflow-auto pb-36">
    <AppHeader />
    <main>
      <UContainer>
        <slot />
      </UContainer>
    </main>
  </div>
</template>
