import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  // if user is not authenticated, throw an error
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const body = await readValidatedBody(event, insertTodoSchema.safeParse)
  // if body is not valid, throw an error
  if (!body.success) {
    const zodError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }
  // if user is not the owner of the todo, throw an error
  if (body.data.userId !== session.user.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  try {
    const newTodo = await createTodo(body.data)
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
