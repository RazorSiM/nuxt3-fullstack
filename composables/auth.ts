import type { UserId } from 'lucia'

export function useUser() {
  interface User {
    username: string
    email: string
    id: UserId
  }
  const user = useState<User | null>('user', () => null)
  const authenticatedUser = computed(() => {
    if (!user.value)
      throw createError('authenticatedUser can only be used in protected pages')

    return user.value
  })
  return {
    user,
    authenticatedUser,
  }
}
