import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddTodoRequest, EditTodoRequest } from '@/types'
import {
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodoUserId
} from '@/service/todoService'

export const todoController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  //　一覧取得（GET）
  fastify.get('/todos', async (request, reply) => {
    const userNo = request.session.get('userNo')
    if (!userNo) return reply.status(401).send({ message: 'AUTH ERROR' })
    const todos = await getTodoUserId(userNo)
    reply.status(200).send(todos)
  })

  //　登録（POST）
  fastify.post<{ Body: AddTodoRequest }>('/todos', async (request, reply) => {
    try {
      const body = request.body
      const userNo = request.session.get('userNo')
      request.session.set('userNo', userNo)
      if (!userNo) return reply.status(401).send({ message: 'AUTH ERROR' })
      const result = await addTodo(body, userNo)
      reply.status(201).send({ message: 'Todo added', result })
    } catch (error) {
      console.error('POST /todos error:', error)
      reply.status(500).send({ message: 'Failed to add todo' })
    }
  })

  //　一件取得(GET)
  fastify.get<{ Params: { id: number } }>(
    '/todos/:id',
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
    Body: Omit<EditTodoRequest, 'id'>
  }>('/todos/:id', async (request, reply) => {
    try {
      const id = request.params.id
      const todo: EditTodoRequest = {
        id,
        title: request.body.title,
        content: request.body.content,
        priority: request.body.priority,
        limitedDate: request.body.limitedDate
      }
      const userNo = request.session.get('userNo')
      request.session.set('userNo', userNo)
      if (!userNo) return reply.status(401).send({ message: 'AUTH ERROR' })
      const result = await updateTodo(todo, userNo)
      reply.status(200).send({ message: 'Todo updated', result })
    } catch (error) {
      console.error('PUT /todos/:id error:', error)
      reply.status(500).send({ message: 'Failed to update todo' })
    }
  })
  //　削除(DELETE)
  fastify.delete<{ Params: { id: number } }>(
    '/todos/:id',
    async (request, reply) => {
      try {
        const id = request.params.id
        const userNo = request.session.get('userNo')
        if (!userNo) return reply.status(401).send({ message: 'AUTH ERROR' })
        const result = await deleteTodo(id, userNo)
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
