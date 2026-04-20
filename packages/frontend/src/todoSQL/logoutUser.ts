export async function logoutUser() {
  try {
    const check = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: 'DELETE',
        credentials: 'include'
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
