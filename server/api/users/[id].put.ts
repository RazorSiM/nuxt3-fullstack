import { zh } from 'h3-zod'
import { fromZodError } from 'zod-validation-error'
import { z } from 'zod'
import { updateUser } from '@/database/users/handlers'

// update user params schema - only the address is supported, user data is fetched from the auth provider
const updateSchema = z.object({
  address: z.string().startsWith('0x').length(42),
})

export default defineEventHandler(async (event) => {
  const params = await zh.useSafeValidatedParams(event, {
    id: zh.intAsString,
  })
  const body = await zh.useSafeValidatedBody(event, updateSchema)

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
    const updatedUser = await updateUser(params.data.id, body.data.address)
    return updatedUser
  }
})
