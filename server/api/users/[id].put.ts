import { zh } from 'h3-zod'
import { fromZodError } from 'zod-validation-error'
import { insertUserSchema } from '@/database/users/schema'
import { updateUser } from '@/database/users/handlers'

export default defineEventHandler(async (event) => {
  const params = await zh.useSafeValidatedParams(event, {
    id: zh.intAsString,
  })
  const body = await zh.useSafeValidatedBody(event, insertUserSchema)

  if (!body.success) {
    const validationError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      message: validationError.toString(),
    })
  }
  else if (!params.success) {
    const validationError = fromZodError(params.error)
    throw createError({
      statusCode: 422,
      message: validationError.toString(),
    })
  }
  else {
    const updatedUser = await updateUser(params.data.id, body.data)
    return updatedUser
  }
})
