import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { AddTodoRequest, EditTodoRequest } from '@/types'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, priority_content, limit_date,created_at, updated_at,user_no FROM todos ORDER BY id ASC'
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      priority: row.priority_content,
      limitedDate: row.limit_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userNo: row.user_no
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getTodoUserId = async (userNo: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, priority_content, limit_date,created_at, updated_at,user_no FROM todos WHERE user_no = ?',
      [userNo]
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      priority: row.priority_content,
      limitedDate: row.limit_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userNo: row.user_no
    }))
  } catch (error) {
    console.error('Error fetching todo by id:', error)
    throw error
  }
}
export const getTodoById = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, priority_content, limit_date,created_at, updated_at,user_no FROM todos WHERE id = ?',
      [id]
    )
    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      priority: row.priority_content,
      limitedDate: row.limit_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      userId: row.user_id
    }
  } catch (error) {
    console.error('Error fetching todo by id:', error)
    throw error
  }
}

export const addTodo = async (data: AddTodoRequest, userNo: number) => {
  const { title, content, priority, limitedDate } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO todos (title, content, priority_content, limit_date, created_at, updated_at, user_no) VALUES (?, ?, ?, ?, NOW(), NOW(), ?)',
      [title, content, priority, limitedDate, userNo]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}

export const updateTodo = async (data: EditTodoRequest, userNo: number) => {
  const { title, content, priority, limitedDate, id } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE todos SET title = ?, content = ?, priority_content=?, limit_date=?, updated_at = NOW() WHERE id = ? AND user_no = ?',
      [title, content, priority, limitedDate, id, userNo]
    )
    return result
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

export const deleteTodo = async (id: number, userNo: number) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM todos WHERE id = ? AND user_no = ?',
      [id, userNo]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
