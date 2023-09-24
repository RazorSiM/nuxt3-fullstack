import { fromZodError } from 'zod-validation-error'
import { z } from 'zod'

const updateSchema = z.object({
  id: z.number(),
  userId: z.string(),
  newIndex: z.number().optional(),
  oldIndex: z.number().optional(),
  completed: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  position: z.number().optional(),
})
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
  const body = await readValidatedBody(event, updateSchema.safeParse)
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
    if (body.data.newIndex !== undefined && body.data.oldIndex !== undefined) {
      const { updatedTodos, updatedTodo } = await updateTodoPosition(body.data.id, body.data.newIndex, body.data.oldIndex)
      return { updatedTodos, updatedTodo }
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
})
