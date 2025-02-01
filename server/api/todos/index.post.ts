import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const body = await readBody(event)
  body.userId = session.user.id

  const payload = insertTodoSchema.safeParse(body)

  if (!payload.success) {
    const zodError = fromZodError(payload.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  try {
    const newTodo = await createTodo(payload.data)
    return newTodo
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
