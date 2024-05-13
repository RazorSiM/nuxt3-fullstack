export default defineEventHandler(async (event) => {
  if (!event.context.session || !event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  try {
    const todos = await selectTodosFromUser(event.context.user.id)
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
