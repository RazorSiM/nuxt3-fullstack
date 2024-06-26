export default defineEventHandler(async (event) => {
  if (!event.context.session)
    return sendRedirect(event, '/login')

  const lucia = initializeLucia(hubDatabase())
  await lucia.invalidateSession(event.context.session?.id)

  return sendRedirect(event, '/login')
})
