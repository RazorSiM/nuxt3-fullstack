import { and, asc, eq, gte, lte, ne, sql } from 'drizzle-orm'
import { z } from 'zod'
import { generateIdFromEntropySize } from 'lucia'
import type { User } from './schema'
import { oauthAccountTable, todoTable, userTable } from './schema'
import { useDrizzle } from './index'

export async function createOauthAccount(providerId: string, providerUserId: string, userId: string) {
  const result = await useDrizzle().insert(oauthAccountTable).values({ providerId, providerUserId, userId }).returning()
  return result[0]
}

export async function getExistingOauthAccount(providerId: string, userId: string) {
  const prepared = useDrizzle()
    .select()
    .from(oauthAccountTable)
    .where(
      and(
        eq(oauthAccountTable.providerId, sql.placeholder('providerId')),
        eq(oauthAccountTable.userId, sql.placeholder('userId')),
      ),
    )
    .prepare()

  const result = await prepared.execute({ providerId, userId })
  if (result.length === 0)
    return null

  return result[0]
}

export async function createUser(username: string, email: string) {
  const id = generateIdFromEntropySize(10)
  const result = await useDrizzle().insert(userTable).values({ id, username, email }).returning()
  return result[0]
}

export async function selectUserByEmail(email: string) {
  const prepared = useDrizzle()
    .select()
    .from(userTable)
    .where(eq(userTable.email, sql.placeholder('email')))
    .prepare()

  const result = await prepared.execute({ email })
  if (result.length === 0)
    return null

  return result[0]
}

export async function selectUserByID(id: string) {
  const prepared = useDrizzle()
    .select()
    .from(userTable)
    .where(eq(userTable.id, sql.placeholder('id')))
    .prepare()

  const result = await prepared.execute({ id })
  if (result.length === 0)
    return null

  return result[0]
}

export async function modifyUsername(userId: string, username: string): Promise<User> {
  const result = await useDrizzle().update(userTable).set({ username }).where(eq(userTable.id, userId)).returning()
  return result[0]
}

export async function deleteTodoFromUser(id: number, userId: string) {
  const result = await useDrizzle().update(todoTable).set({ deleted: true, deletedAt: new Date().toISOString() }).where(
    and(
      eq(todoTable.id, id.toString()),
      eq(todoTable.userId, userId),
    ),
  ).returning()
  return result[0]
}
export async function selectTodo(id: number) {
  const result = await useDrizzle().select().from(todoTable).where(eq(todoTable.id, id.toString()))
  if (result.length === 0)
    return null

  return result[0]
}

export async function selectTodosFromUser(userId: string) {
  const prepared = useDrizzle()
    .select({ id: todoTable.id, title: todoTable.title, description: todoTable.description, completed: todoTable.completed, position: todoTable.position, createdAt: todoTable.createdAt, updatedAt: todoTable.updatedAt })
    .from(todoTable)
    .where(
      and(
        eq(todoTable.userId, sql.placeholder('userId')),
        eq(todoTable.deleted, false),
      ),
    )
    .orderBy(asc(todoTable.position))
    .prepare()

  const result = await prepared.execute({ userId })
  return result
}
export type SelectTodoFromUserReturn = ReturnType<typeof selectTodosFromUser>

export async function createTodo(todo: TodoInsert) {
  const result = await useDrizzle().transaction(async (tx) => {
    const findNextPosition = tx.select({ position: sql<number>`coalesce(max(${todoTable.position}), 0) + 1` }).from(todoTable).where(eq(todoTable.userId, todo.userId))
    const nextPositionQueryResult = await findNextPosition.execute()
    const nextPosition = nextPositionQueryResult[0].position

    const result = await tx.insert(todoTable).values({ ...todo, position: nextPosition }).returning()
    return result[0]
  })

  return result
}

export const updateTodoPositionSchema = z.object({
  id: z.number(),
  userId: z.string(),
  newIndex: z.number(),
  currentIndex: z.number(),
})
export type UpdateTodoPositionSchema = z.infer<typeof updateTodoPositionSchema>
export async function updateTodoPosition(payload: UpdateTodoPositionSchema) {
  if (payload.currentIndex === payload.newIndex) {
    return {
      updateCurrentPosition: [],
      updateAffectedPositions: [],
    }
  }
  const result = await useDrizzle().transaction(async (tx) => {
    const updatedCurrentPosition = await tx.update(todoTable).set({ position: payload.newIndex }).where(and(eq(todoTable.id, payload.id.toString()), eq(todoTable.userId, payload.userId))).returning()
    let updatedAffectedPosition = null
    if (payload.newIndex < payload.currentIndex) {
      updatedAffectedPosition = await tx.update(todoTable).set({ position: sql<number>`${todoTable.position} + 1` }).where(
        and(
          eq(todoTable.userId, payload.userId),
          ne(todoTable.id, payload.id.toString()),
          gte(todoTable.position, payload.newIndex),
        ),
      ).returning()
    }
    else {
      updatedAffectedPosition = await tx.update(todoTable).set({ position: sql<number>`${todoTable.position} - 1` }).where(
        and(
          eq(todoTable.userId, payload.userId),
          ne(todoTable.id, payload.id.toString()),
          ne(todoTable.position, 1),
          lte(todoTable.position, payload.newIndex),
        ),
      ).returning()
    }
    return {
      updateCurrentPosition: updatedCurrentPosition,
      updateAffectedPositions: updatedAffectedPosition,
    }
  })
  return result
}

export const updateTodoSchema = z.object({
  id: z.number(),
  userId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
})
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>
export async function updateTodo(todo: UpdateTodoSchema, userId: string) {
  try {
    const result = useDrizzle().update(todoTable).set({ ...todo, id: todo.id.toString(), updatedAt: new Date().toISOString() }).where(
      and(
        eq(todoTable.id, todo.id.toString()),
        eq(todoTable.userId, userId),
      ),
    ).returning()
    return result
  }
  catch (e) {
    if (e instanceof Error)
      throw new Error(e.message)
    else
      throw new Error('Internal Server Error: Unknown error occurred')
  }
}
