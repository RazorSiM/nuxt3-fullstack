export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const dbUser = await selectUserByID(user.id)
  return {
    user: dbUser,
  }
})
