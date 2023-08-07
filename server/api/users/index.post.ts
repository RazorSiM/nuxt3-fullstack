import { zh } from 'h3-zod'
import { fromZodError } from 'zod-validation-error'
import { addUser } from '@/database/users/handlers'
import { insertUserSchema } from '@/database/users/schema'

export default defineEventHandler(async (event) => {
  const body = await zh.useSafeValidatedBody(event, insertUserSchema)

  if (!body.success) {
    const validationError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      message: validationError.toString(),
    })
  }
  else {
    const newUser = await addUser(body.data)
    return newUser
  }
})
