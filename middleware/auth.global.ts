export default defineNuxtRouteMiddleware(async () => {
  const { user } = useUser()
  if (import.meta.server) {
    const { data, error } = await useFetch('/api/user')
    if (error.value)
      throw createError('Failed to fetch user data')
    user.value = data.value?.user ?? null
  }

  if (import.meta.client) {
    const data = await $fetch('/api/user')
    user.value = data?.user ?? null
  }
})
