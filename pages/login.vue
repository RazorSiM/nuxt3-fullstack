<script lang="ts" setup>
const { user } = await useUser()
if (user.value)
  await navigateTo('/user') // redirect to profile page
</script>

<template>
  <div class="mt-10 flex flex-col gap-5 items-center justify-center p-5 border-1 border-zinc-300 mx-auto w-fit rounded-lg">
    <BaseButton>
      <a href="/api/login/github">Sign in with Github</a>
    </BaseButton>
    <BaseButton>
      <a href="/api/login/discord">Sign in with Discord</a>
    </BaseButton>
    <BaseButton>
      <a href="/api/login/google">Sign in with Google</a>
    </BaseButton>
  </div>
</template>
