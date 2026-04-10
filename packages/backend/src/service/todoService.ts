import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { AddTodo, EditTodo } from '@/types'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, time_limit,created_at, updated_at FROM todos ORDER BY id ASC'
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      limitedAt: row.time_limit,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getTodoById = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, time_limit,created_at, updated_at FROM todos WHERE id = ?',
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      limitedAt: row.time_limit,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  } catch (error) {
    console.error('Error fetching todo by id:', error)
    throw error
  }
}

export const addTodo = async (data: AddTodo) => {
  const { title, content, limitedAt } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (title, content,time_limit, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [title, content, limitedAt]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}

export const updateTodo = async (data: EditTodo) => {
  const { title, content, limitedAt, id } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todos SET title = ?, content = ?, time_limit=?,updated_at = NOW() WHERE id = ?',
      [title, content, limitedAt, id]
    )
    return result
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export const deleteTodo = async (id: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ?',
      [id]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
