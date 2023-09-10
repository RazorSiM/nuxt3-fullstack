import { and, eq, sql } from 'drizzle-orm'
import type { Todo, User } from './schema'
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
    .select({ id: todos.id, title: todos.title, description: todos.description, completed: todos.completed, createdAt: todos.createdAt, updatedAt: todos.updatedAt })
    .from(todos)
    .where(
      and(
        eq(todos.userId, sql.placeholder('userId')),
        eq(todos.deleted, false),
      ),
    )
    .prepare('selectTodosFromUser')

  const result = await prepared.execute({ userId })
  return result
}

export async function createTodo(todo: TodoInsert): Promise<Todo> {
  const result = await db.insert(todos).values(todo).returning()
  return result[0]
}
