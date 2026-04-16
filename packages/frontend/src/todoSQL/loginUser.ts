import type { CheckUserRequest } from '@/shared/types'

export async function loginUser(data: CheckUserRequest) {
  try {
    const check = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${data.userId}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    if (!check.ok) {
      const status = check.status
      const body = await check.text()
      const message = `failed to fetch users. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }
    return check.json()
  } catch (error) {
    console.error('Error posting user:', error)
    throw error
  }
}
