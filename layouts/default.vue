<script lang="ts" setup>
</script>

<template>
  <div class="bg-background h-screen w-screen overflow-auto pb-36">
    <AppHeader />
    <main>
      <div class="container mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
