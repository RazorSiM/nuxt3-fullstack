<script lang="ts" setup>
const isSignupForm = ref(false)
const toggleText = computed(() => {
  return (isSignupForm.value ? 'Login' : 'Sign up') + ' instead'
})
</script>

<template>
  <div>
    <FormAuthSignup v-if="isSignupForm" />
    <FormAuthLogin v-else />
    <p
      class="hover:underline transition-all cursor-pointer text-xs text-right"
      @click="isSignupForm = !isSignupForm"
    >
      {{ toggleText }}
    </p>
  </div>
</template>
