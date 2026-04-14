export async function deleteTodo(id: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      throw new Error(`Delete failed: status ${status}, body: ${body}`)
    }

    return res.json()
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
