import type { User } from 'lucia'

export function useUser() {
  const user = useState<User | null>('user', () => null)
  const authenticatedUser = computed(() => {
    const userValue = unref(user)
    if (!userValue) {
      throw createError(
        'useAuthenticatedUser() can only be used in protected pages',
      )
    }
    return userValue
  })
  return {
    user,
    authenticatedUser,
  }
}
