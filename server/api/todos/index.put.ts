import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  const userId = event.context.session.user.userId
  const body = await readBody(event)
  body.userId = userId

  const payload = await updateTodoPositionSchema.safeParse(body)
  // if body is not valid, throw an error
  if (!payload.success) {
    const zodError = fromZodError(payload.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  try {
    const res = await updateTodoPosition(payload.data)
    return res
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
