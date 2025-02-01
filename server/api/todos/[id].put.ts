import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const body = await readBody(event)
  body.id = Number.parseInt(id)
  body.userId = session.userId

  const payload = updateTodoSchema.safeParse(body)

  if (!payload.success) {
    const zodError = fromZodError(payload.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  try {
    const updatedTodo = await updateTodo(payload.data, session.user.id)
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
