import type { FastifyPluginAsync, FastifyInstance } from 'fastify'
import { getAllUsers } from '@/service/backService'

export const sampleController: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.get('/sample', async (_, reply) => {
    const users = await getAllUsers()
    reply.status(200).send(users)
  })
}
