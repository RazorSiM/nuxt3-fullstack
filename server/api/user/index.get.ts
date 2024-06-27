export default defineEventHandler(async (event) => {
  const { user } = await getUserAndSession(event)
  return {
    user: user,
  }
})
