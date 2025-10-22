import { pool } from '@/db'
import type { RowDataPacket } from 'mysql2'
import type { User } from '@/types'

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users')
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      eMail: row.e_mail,
      createdAt: row.created_at.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}
