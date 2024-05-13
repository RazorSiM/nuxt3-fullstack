export default defineEventHandler(async (event) => {
  if (!event.context.session || !event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const userId = event.context.user?.id

  const id = await getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  try {
    const deletedTodo = await deleteTodoFromUser(Number.parseInt(id), userId)
    return deletedTodo
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
