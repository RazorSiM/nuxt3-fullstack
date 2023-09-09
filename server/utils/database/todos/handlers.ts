import { and, eq, sql } from 'drizzle-orm'
import { db } from '../index'
import type { Todo } from './schema'
import { todos } from './schema'

export async function selectTodosFromUser(userId: string) {
  const prepared = db
    .select({ id: todos.id, title: todos.title, completed: todos.completed, createdAt: todos.createdAt, updatedAt: todos.updatedAt })
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
