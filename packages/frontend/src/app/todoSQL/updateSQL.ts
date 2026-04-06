import type { EditTodo } from '@shared/types'

export async function updateSQL(data: EditTodo) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todos/${data.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          limitedAt: data.limitedAt
        })
      }
    )

    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to update todo. error(status: ${status}, body: ${body}})`
      throw new Error(message)
    }

    return res.json()
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}
