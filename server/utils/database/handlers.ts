import { and, asc, eq, gte, lt, sql } from 'drizzle-orm'
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
    const findNextPosition = tx.select({ position: sql<number>`coalesce(max(${todos.position}), 0) + 1` }).from(todos)
    const nextPositionQueryResult = await findNextPosition.execute()
    const nextPosition = nextPositionQueryResult[0].position

    const result = await tx.insert(todos).values({ ...todo, position: nextPosition }).returning()
    return result[0]
  })

  return result
}

export async function updateTodoPosition(todoId: number, newPosition: number, oldPosition: number) {
  const result = await db.transaction(async (tx) => {
    const updatedTodos = await tx.update(todos)
      .set({ position: sql<number>`${todos.position} + 1` })
      .where(
        and(
          gte(todos.position, newPosition),
          lt(todos.position, oldPosition),
        ),
      ).returning()
    const updatedAffectedTodo = await tx.update(todos)
      .set({ position: sql<number>`${todos.position} - 1` })
      .where(
        eq(todos.position, newPosition),
      )

    const updatedTodo = await tx.update(todos)
      .set({ position: newPosition })
      .where(
        eq(todos.id, todoId),
      ).returning()

    return { updatedTodos, updatedAffectedTodo, updatedTodo: updatedTodo[0] }
  })

  return result
}
