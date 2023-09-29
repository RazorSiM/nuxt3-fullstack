export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' && event.method !== 'DELETE') {
    const body = await readBody(event)
    if (body && body.userId) {
      if (body.userId !== event.context.session.user.userId) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
        })
      }
    }
  }
})
