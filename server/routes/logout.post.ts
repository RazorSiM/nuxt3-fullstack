export default defineEventHandler(async (event) => {
  const { session, lucia } = await getUserAndSession(event)
  if (!session)
    return sendRedirect(event, '/login')

  await lucia.invalidateSession(session.id)

  return sendRedirect(event, '/login')
})
