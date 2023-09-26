import { fromZodError } from 'zod-validation-error'

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

  // const body = await readValidatedBody(event, updateTodoSchema.safeParse)
  const partialBody = await readBody(event)
  partialBody.id = Number.parseInt(id)

  const body = updateTodoSchema.safeParse(partialBody)
  if (!body.success) {
    const zodError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  if (body.data.userId !== session.user.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  try {
    const updatedTodo = await updateTodo(body.data)
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
