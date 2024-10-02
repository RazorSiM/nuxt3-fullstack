import { fromZodError } from 'zod-validation-error'
import { userLoginFormSchema } from '~/utils/schemas'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const userLoginForm = userLoginFormSchema.safeParse(payload)

  if (!userLoginForm.success) {
    const zodError = fromZodError(userLoginForm.error)
    throw createError({
      status: 400,
      message: zodError.toString(),
    })
  }

  await authenticatePasswordUser(userLoginForm.data.email, userLoginForm.data.password, event)

  // redirect the user to the user page
  return sendRedirect(event, '/user')
})
