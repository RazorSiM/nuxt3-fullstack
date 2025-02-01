export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  try {
    const todos = await selectTodosFromUser(session.user.id)
    return todos
  }
  catch (e) {
    if (e instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal Server Error: ${e.message}`,
      })
    }
    else {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal Server Error: ${e}`,
      })
    }
  }
})
