import { selectTodo } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const id = await getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  try {
    const todo = await selectTodo(Number.parseInt(id))
    if (!todo) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    }
    if (todo.userId !== session.user.userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      })
    }
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

  try {
    const deletedTodo = await deleteTodo(Number.parseInt(id))
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
