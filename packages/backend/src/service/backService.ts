import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { addUser, editUser } from '@/types'

export const getAllTodos = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at FROM users ORDER BY id ASC'
    )
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getTodoNo = async (id: number) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, content, created_at, updated_at FROM users WHERE id = ?',
      [id]
    )

    if (rows.length === 0) return null

    const row = rows[0]
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  } catch (error) {
    console.error('Error fetching todo by id:', error)
    throw error
  }
}

export const addTodo = async (data: addUser) => {
  const { title, content } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (title, content, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [title, content]
    )
    return result
  } catch (error) {
    console.error('Error inserting todo:', error)
    throw error
  }
}

export const updateTodo = async (data: editUser) => {
  const { title, content, id } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET title = ?, content = ?, updated_at = NOW() WHERE id = ?',
      [title, content, id]
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
      'DELETE FROM users WHERE id = ?',
      [id]
    )
    return result
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
