import type { AddUserRequest } from '@/shared/types'

export async function additionUser(data: AddUserRequest) {
  try {
    const write = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!write.ok) {
      const status = write.status
      const body = await write.text()
      const message = `failed to fetch users. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return write.json()
  } catch (error) {
    console.error('Error posting user:', error)
    throw error
  }
}
