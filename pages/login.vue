<script lang="ts" setup>
const { status, data, signIn, signOut } = useAuth()
definePageMeta({ auth: false })
</script>

<template>
  <div>
    <pre>{{ status }}</pre>
    <pre>{{ data }}</pre>
    <button @click="signIn('github')">
      Sign In with GitHub
    </button>
    <button @click="signIn('discord')">
      Sign In with Discord
    </button>
    <button @click="signOut()">
      Sign Out
    </button>
  </div>
</template>
