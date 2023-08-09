import { zh } from 'h3-zod'
import { fromZodError } from 'zod-validation-error'
import { z } from 'zod'
import { getServerSession } from '#auth'
import { updateUser } from '@/database/users/handlers'

// update user params schema - only the address is supported, user data is fetched from the auth provider
const updateSchema = z.object({
  address: z.string().startsWith('0x').length(42),
  email: z.string().email(),
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const params = await zh.useSafeValidatedParams(event, {
    id: z.string().uuid(),
  })
  const body = await zh.useSafeValidatedBody(event, updateSchema)

  if (!body.success) {
    const validationError = fromZodError(body.error)
    throw createError({
      statusCode: 400,
      message: validationError.toString(),
    })
  }
  if (!params.success) {
    const validationError = fromZodError(params.error)
    throw createError({
      statusCode: 422,
      message: validationError.toString(),
    })
  }
  if (!session || session.user?.email !== body.data.email) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  else {
    const updatedUser = await updateUser(params.data.id, session.user.email)
    return updatedUser
  }
})
