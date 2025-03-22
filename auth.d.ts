declare module '#auth-utils' {
  interface User {
    username: string
    email: string
    id: string
  }
  interface UserSession {
    user?: {
      id: string
      username: string
      email: string
    }
    sessionToken?: string
  }
}
export {}
