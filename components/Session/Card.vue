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
  <UiCard

    :key="id"
    :class="isCurrentSession ? 'border-green-700' : ''"
    class="flex flex-col h-full justify-between"
  >
    <UiCardHeader>
      <UiCardTitle>{{ isCurrentSession ? 'Current Session' : 'Other Session' }}</UiCardTitle>
      <UiCardDescription>
        {{ isCurrentSession ? 'This is your current browser session, to delete this one, logout.' : 'This is an active session from another device.' }}
      </UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="grid grid-cols-1">
      <div class="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground break-all">
        <Icon
          name="ph:hash-fill"
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
        <Icon
          name="pajamas:expire"
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
    </UiCardContent>
    <UiCardFooter>
      <UiButton
        :disabled="isCurrentSession"
        variant="destructive"
        size="xs"
        @click="emit('invalidateUserSession', id)"
      >
        <Icon name="heroicons:trash" /> Invalidate Session
      </UiButton>
    </UiCardFooter>
  </UiCard>
</template>
