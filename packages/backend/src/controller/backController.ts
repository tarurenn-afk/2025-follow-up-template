import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodo, EditTodo } from '@/types'
import {
  getAllTodos,
  getTodoNo,
  addTodo,
  updateTodo,
  deleteTodo
} from '@/service/backService'

export const backController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  // 一覧取得（GET）
  fastify.get('/todos', async (_, reply) => {
    const todos = await getAllTodos()
    reply.status(200).send(todos)
  })

  // 登録（POST）
  fastify.post<{ Body: AddTodo }>('/todos', async (request, reply) => {
    console.log('request.body:', request.body)
    try {
      const body = request.body
      const result = await addTodo(body)
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todos error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  //番号限定(編集ページ用)
  fastify.get<{ Params: { id: number } }>(
    '/todos/:id',
    async (request, reply) => {
      try {
        const id = Number(request.params.id)
        const todo = await getTodoNo(id)
        if (!todo) return reply.status(404).send({ message: 'Todo not found' })
        reply.status(200).send(todo)
      } catch (error) {
        console.error('GET /todos/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )

  fastify.put<{
    Params: { id: number }
    Body: Omit<EditTodo, 'id'>
  }>('/todos/:id', async (request, reply) => {
    try {
      const id = Number(request.params.id)
      const check: EditTodo = {
        id,
        title: request.body.title,
        content: request.body.content
      }

      const result = await updateTodo(check)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todos/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })
  //削除(DELETE)
  fastify.delete('/todos/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: number }
      const result = await deleteTodo(Number(id))

      if (result.affectedRows === 0) {
        return reply.status(404).send({ message: 'Todo not found' })
      }

      reply.status(200).send({ message: 'Todo deleted' })
    } catch (error) {
      console.error('DELETE /todos/:id error:', error)
      reply.status(500).send({ message: 'Failed to delete todo' })
    }
  })
}
