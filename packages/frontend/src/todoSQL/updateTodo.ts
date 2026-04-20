import type { EditTodoRequest } from '@/shared/types'

export async function updateTodo(data: EditTodoRequest) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/todos/${data.id}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          priority: data.priority,
          limitedDate: data.limitedDate,
          publicOn: data.publicOn
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
