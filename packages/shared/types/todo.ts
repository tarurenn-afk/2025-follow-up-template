export type Todo = {
  id: number
  title: string
  content: string
  priority: string
  limitedDate: string
  publicOn: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export type AddTodoRequest = {
  title: string
  content: string
  priority: string
  limitedDate: string
  publicOn: boolean
}
export type EditTodoRequest = {
  id: number
  title: string
  content: string
  priority: string
  limitedDate: string
  publicOn: boolean
}
