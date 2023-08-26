<script lang="ts" setup>
const user = await useUser()
if (user.value)
  await navigateTo('/user') // redirect to profile page
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <h1>Sign in</h1>
    <div class="flex flex-col gap-4">
      <button>
        <a href="/api/login/github">Sign in with Github</a>
      </button>
      <button>
        <a href="/api/login/discord">Sign in with Discord</a>
      </button>
      <button>
        <a href="/api/login/google">Sign in with Google</a>
      </button>
    </div>
  </div>
</template>
