<script lang="ts" setup>
defineProps<{
  id: string
  expiresAt: string
  userId: string
  isCurrentSession: boolean
}>()

const emit = defineEmits<{
  invalidateUserSession: [sessionId: string]
}>()
</script>

<template>
  <UCard

    :key="id"
  >
    <template #header>
      <p>{{ isCurrentSession ? 'Current Session' : 'Other Session' }}</p>
      <p>
        {{ isCurrentSession ? 'This is your current browser session, to delete this one, logout.' : 'This is an active session from another device.' }}
      </p>
    </template>
    <div class="grid grid-cols-1">
      <div class="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground break-all">
        <UIcon
          name="i-ph:hash-fill"
          size="2rem"
        />
        <div class="space-y-1">
          <p class="text-sm font-medium leading-none">
            Session ID
          </p>
          <p class="text-sm text-muted-foreground">
            {{ id }}
          </p>
        </div>
      </div>
      <div class="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
        <UIcon
          name="i-pajamas:expire"
          size="2rem"
        />
        <div class="space-y-1">
          <p class="text-sm font-medium leading-none">
            Expiration
          </p>
          <p class="text-sm text-muted-foreground">
            {{ expiresAt }}
          </p>
        </div>
      </div>
    </div>
    <template #footer>
      <UButton
        :disabled="isCurrentSession"
        variant="solid"
        color="error"
        size="xs"
        icon="i-heroicons:trash"
        @click="emit('invalidateUserSession', id)"
      >
        Invalidate Session
      </UButton>
    </template>
  </UCard>
</template>
