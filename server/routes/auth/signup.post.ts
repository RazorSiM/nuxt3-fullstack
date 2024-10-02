import { fromZodError } from 'zod-validation-error'
import { userSignupFormSchema } from '~/utils/schemas'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  }

  const userSignupForm = userSignupFormSchema.safeParse(payload)

  if (!userSignupForm.success) {
    const zodError = fromZodError(userSignupForm.error)
    throw createError({
      status: 400,
      message: zodError.toString(),
    })
  }

  await createNewPasswordUser(userSignupForm.data.email, userSignupForm.data.password, event)

  // redirect the user to the user page
  return sendRedirect(event, '/user')
})
