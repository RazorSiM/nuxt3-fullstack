import { eq, sql } from 'drizzle-orm'
import { db } from '../index'
import type { Todo } from './schema'
import { todos } from './schema'

export async function selectTodosFromUser(userId: string): Promise<Todo[]> {
  const prepared = db
    .select()
    .from(todos)
    .where(eq(todos.userId, sql.placeholder('userId')))
    .prepare('selectTodosFromUser')

  const result = await prepared.execute({ userId })
  return result
}

export async function createTodo(todo: TodoInsert): Promise<Todo> {
  const result = await db.insert(todos).values(todo).returning()
  return result[0]
}
