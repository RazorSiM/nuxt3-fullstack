import { zh } from 'h3-zod'
import { selectUser } from '@/database/users/handlers'

export default defineEventHandler(async (event) => {
  const params = await zh.useValidatedParams(event, {
    id: zh.intAsString,
  })

  const idParam = params.id

  const user = await selectUser(idParam)
  return user
})
