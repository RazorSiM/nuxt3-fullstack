import { z } from 'zod'

export const userSignupFormSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
})
export type UserSignupForm = z.infer<typeof userSignupFormSchema>

export const userLoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
export type UserLoginForm = z.infer<typeof userLoginFormSchema>

export const userUpdateFormSchema = z.object({
  username: z.string().min(3).max(30),
})
export type UserUpdateForm = z.infer<typeof userUpdateFormSchema>

export const todoCreateFormSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
})
export type TodoCreateForm = z.infer<typeof todoCreateFormSchema>

export const todoUpdateFormSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  description: z.string().nullable(),
})
export type TodoUpdateForm = z.infer<typeof todoUpdateFormSchema>

export const isTodoUpdateForm = (values: TodoCreateForm | TodoUpdateForm): values is TodoUpdateForm => {
  return 'id' in values
}
