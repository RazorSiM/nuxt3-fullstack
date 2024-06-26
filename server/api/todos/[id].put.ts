import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  if (!event.context.session || !event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const userId = event.context.user.id

  const body = await readBody(event)
  body.id = Number.parseInt(id)
  body.userId = userId

  const payload = updateTodoSchema.safeParse(body)

  if (!payload.success) {
    const zodError = fromZodError(payload.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  try {
    const updatedTodo = await updateTodo(payload.data, userId)
    return updatedTodo
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
