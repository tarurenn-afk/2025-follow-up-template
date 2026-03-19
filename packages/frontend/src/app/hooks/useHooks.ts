import useSWR from 'swr'

export type User = {
  id: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function useHooks(): {
  users: User[]
  error: Error | undefined
  isLoading: boolean
} {
  const fetcher = async (url: string): Promise<User[]> => {
    const res = await fetch(url)
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch users. error(status: ${status}, body: ${body})`
      throw new Error(message)
    }
    return res.json()
  }

  const { data, error, isLoading } = useSWR<User[], Error>(
    'http://localhost:8000/users',
    fetcher
  )

  return { users: data || [], error, isLoading }
}
