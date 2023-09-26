import { and, asc, eq, gte, lte, ne, sql } from 'drizzle-orm'
import { z } from 'zod'
import type { User } from './schema'
import { todos, users } from './schema'
import { db } from './index'

export async function selectUserByEmail(email: string): Promise<User> {
  const prepared = db
    .select()
    .from(users)
    .where(eq(users.email, sql.placeholder('email')))
    .prepare('selectUserByEmail')

  const result = await prepared.execute({ email })
  return result[0]
}

export async function selectUserByID(id: string): Promise<User> {
  const prepared = db
    .select()
    .from(users)
    .where(eq(users.id, sql.placeholder('id')))
    .prepare('selectUserByID')

  const result = await prepared.execute({ id })
  return result[0]
}

export async function modifyUsername(userId: string, username: string): Promise<User> {
  const result = await db.update(users).set({ username }).where(eq(users.id, userId)).returning()
  return result[0]
}

export async function deleteTodo(id: number) {
  const result = await db.update(todos).set({ deleted: true }).where(eq(todos.id, id)).returning()
  return result[0]
}
export async function selectTodo(id: number) {
  const result = await db.select().from(todos).where(eq(todos.id, id))
  return result[0]
}

export async function selectTodosFromUser(userId: string) {
  const prepared = db
    .select({ id: todos.id, title: todos.title, description: todos.description, completed: todos.completed, position: todos.position, createdAt: todos.createdAt, updatedAt: todos.updatedAt })
    .from(todos)
    .where(
      and(
        eq(todos.userId, sql.placeholder('userId')),
        eq(todos.deleted, false),
      ),
    )
    .orderBy(asc(todos.position))
    .prepare('selectTodosFromUser')

  const result = await prepared.execute({ userId })
  return result
}

export async function createTodo(todo: TodoInsert) {
  const result = await db.transaction(async (tx) => {
    const findNextPosition = tx.select({ position: sql<number>`coalesce(max(${todos.position}), 0) + 1` }).from(todos).where(eq(todos.userId, todo.userId))
    const nextPositionQueryResult = await findNextPosition.execute()
    const nextPosition = nextPositionQueryResult[0].position

    const result = await tx.insert(todos).values({ ...todo, position: nextPosition }).returning()
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
  const result = await db.transaction(async (tx) => {
    const updatedCurrentPosition = await tx.update(todos).set({ position: payload.newIndex }).where(and(eq(todos.id, payload.id), eq(todos.userId, payload.userId))).returning()
    let updatedAffectedPosition = null
    if (payload.newIndex < payload.currentIndex) {
      updatedAffectedPosition = await db.update(todos).set({ position: sql<number>`${todos.position} + 1` }).where(
        and(
          eq(todos.userId, payload.userId),
          ne(todos.id, payload.id),
          gte(todos.position, payload.newIndex),
        ),
      ).returning()
    }
    else {
      updatedAffectedPosition = await db.update(todos).set({ position: sql<number>`${todos.position} - 1` }).where(
        and(
          eq(todos.userId, payload.userId),
          ne(todos.id, payload.id),
          ne(todos.position, 1),
          lte(todos.position, payload.newIndex),
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
export async function updateTodo(todo: UpdateTodoSchema) {
  const result = db.update(todos).set({ ...todo, updatedAt: new Date() }).where(eq(todos.id, todo.id)).returning()
  return result
}
