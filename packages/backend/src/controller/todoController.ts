import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodo, EditTodo } from '@/types'
import {
  getAllTodos,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（GET）
  fastify.get('/todos', async (_, reply) => {
    const todos = await getAllTodos()
    reply.status(200).send(todos)
  })

  // 登録（POST）
  fastify.post<{ Body: AddTodo }>('/todos', async (request, reply) => {
    try {
      const body = request.body
      const result = await addTodo(body)
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todos error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  // 一件取得(GET)
  fastify.get<{ Params: { id: number } }>(
    '/todos/id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const todo = await getTodoById(id)
        if (!todo) return reply.status(404).send({ message: 'Todo not found' })
        reply.status(200).send(todo)
      } catch (error) {
        console.error('GET /todos/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )
  // 更新(PUT)
  fastify.put<{
    Params: { id: number }
    Body: Omit<EditTodo, 'id'>
  }>('/todos/:id', async (request, reply) => {
    try {
      const id = request.params.id
      const todo: EditTodo = {
        id,
        title: request.body.title,
        content: request.body.content,
        limitedDate: request.body.limitedDate
      }

      const result = await updateTodo(todo)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todos/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })
  // 削除(DELETE)
  fastify.delete<{ Params: { id: number } }>(
    '/todos/:id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const result = await deleteTodo(id)

        if (result.affectedRows === 0) {
          return reply.status(404).send({ message: 'Todo not found' })
        }

        reply.status(200).send({ message: 'Todo deleted' })
      } catch (error) {
        console.error('DELETE /todos/:id error:', error)
        reply.status(500).send({ message: 'Failed to delete todo' })
      }
    }
  )
}
