import { fromZodError } from 'zod-validation-error'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, updateTodoPositionSchema.safeParse)
  // if body is not valid, throw an error
  if (!body.success) {
    const zodError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      statusMessage: zodError.toString(),
    })
  }

  try {
    const res = await updateTodoPosition(body.data)
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
