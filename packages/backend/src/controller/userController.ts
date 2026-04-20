import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import type { AddUserRequest, CheckUserRequest } from '@/types'
import { addUser, getUserNo, getAllUser } from '@/service/userService'

export const userController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  //　全ユーザーデータ取得(GET)
  fastify.get('/users', async (_, reply) => {
    const users = await getAllUser()
    reply.status(200).send(users)
  })
  // ログイン(POST)
  fastify.post<{ Body: CheckUserRequest }>(
    '/auth/login',
    async (request, reply) => {
      try {
        const userId = request.body.userId
        const user = await getUserNo(userId)
        const checkUser: CheckUserRequest = {
          userId,
          passwordHash: request.body.passwordHash
        }
        if (!user)
          return reply.status(404).send({ message: 'Invalid id or password' })
        const check = await fastify.bcrypt.compare(
          checkUser.passwordHash,
          user.passwordHash
        )
        if (!check)
          return reply.status(401).send({ message: 'Invalid id or password' })
        request.session.set('userNo', user.user_no)
        reply.status(200).send(user)
      } catch (error) {
        console.error('GET /users/:id error:', error)
        reply.status(500).send({ message: 'Failed to fetch todo' })
      }
    }
  )
  //ユーザーデータ追加(POST)
  fastify.post<{ Body: AddUserRequest }>(
    '/auth/user',
    async (request, reply) => {
      try {
        const user_Id = request.body.userId
        const pass = await request.bcryptHash(request.body.passwordHash)
        const User: AddUserRequest = {
          userId: user_Id,
          passwordHash: pass
        }
        const result = await addUser(User)
        request.session.set('userNo', result.insertId)
        reply.status(201).send({ message: 'User added', result })
      } catch (error) {
        console.error('POST /users error:', error)
        reply.status(500).send({ message: 'Failed to add todo' })
      }
    }
  )
  fastify.delete('/auth/logout', async (request, reply) => {
    try {
      request.session.delete()
    } catch (error) {
      console.error('POST /users error:', error)
      reply.status(500).send({ message: 'Failed to logout user' })
    }
  })
}
