import { zh } from 'h3-zod'
import { fromZodError } from 'zod-validation-error'
import { selectUser } from '@/database/users/handlers'

export default defineEventHandler(async (event) => {
  const params = await zh.useSafeValidatedParams(event, {
    id: zh.intAsString,
  })
  if (!params.success) {
    const validationError = fromZodError(params.error)
    throw createError({
      statusCode: 422,
      message: validationError.toString(),
    })
  }
  else {
    const user = await selectUser(params.data.id)
    return user
  }
})
