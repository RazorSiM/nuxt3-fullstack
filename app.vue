<template>
  <main>
    <header class="p-3 max-w-lg mx-auto flex gap-4 justify-center font-bold">
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/user">
        User
      </NuxtLink>
      <NuxtLink to="/login">
        Login
      </NuxtLink>
    </header>
    <NuxtPage />
  </main>
</template>
