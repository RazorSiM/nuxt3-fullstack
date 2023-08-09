<script lang="ts" setup>
const { status, data, signIn, signOut } = useAuth()
</script>

<template>
  <div>
    <pre>{{ status }}</pre>
    <pre>{{ data }}</pre>
    <button @click="signIn('discord')">
      Sign In
    </button>
    <button @click="signOut()">
      Sign Out
    </button>
  </div>
</template>
