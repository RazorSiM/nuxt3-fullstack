/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./utils/lucia').Auth
  interface DatabaseUserAttributes {
    email: string
    username: string
  }
  interface DatabaseSessionAttributes {}
}
