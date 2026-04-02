export async function deleteSQL(id: number) {
  try {
    const res = await fetch(`http://localhost:8000/todos/${id}`, {
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
