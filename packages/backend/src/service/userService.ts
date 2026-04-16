import { pool } from '@/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import type { AddUserRequest } from '@/types'

export const getAllUser = async () => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT user_id,password_hash FROM users ORDER BY user_id ASC'
    )
    return rows.map((row) => ({
      userId: row.user_id,
      passwordHash: row.password_hash
    }))
  } catch (error) {
    console.error('Error fetching todo:', error)
    throw error
  }
}

export const getUserNo = async (userId: string) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT user_no,password_hash FROM users WHERE user_id = ?',
      [userId]
    )
    if (rows.length === 0) return null

    const row = rows[0]
    return {
      user_no: row.user_no,
      passwordHash: row.password_hash
    }
  } catch (error) {
    console.error('Error fetching user by id:', error)
    throw error
  }
}

export const addUser = async (data: AddUserRequest) => {
  const { userId, passwordHash } = data
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (user_id,password_hash ) VALUES (?, ?)',
      [userId, passwordHash]
    )
    return result
  } catch (error) {
    console.error('Error inserting user:', error)
    throw error
  }
}
