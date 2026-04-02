import useSWR from 'swr'
import type { Todo } from '@shared/types'

export function useTodo(): {
  todos: Todo[]
  error: Error | undefined
  isLoading: boolean
} {
  const fetcher = async (url: string): Promise<Todo[]> => {
    const res = await fetch(url)
    if (!res.ok) {
      const status = res.status
      const body = await res.text()
      const message = `failed to fetch users. error(status: ${status}, body: ${body})`
      throw new Error(message)
    }
    return res.json()
  }

  const { data, error, isLoading } = useSWR<Todo[], Error>(
    'http://localhost:8000/todos',
    fetcher
  )

  return { todos: data || [], error, isLoading }
}
