export type Todo = {
  id: number
  title: string
  content: string
  limitedDate: string
  createdAt: string
  updatedAt: string
}

export type AddTodoRequest = {
  title: string
  content: string
  limitedDate: string
}

export type EditTodoRequest = {
  id: number
  title: string
  content: string
  limitedDate: string
}
