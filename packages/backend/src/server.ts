import Fastify from 'fastify'
import cors from '@fastify/cors'
import secureSession from '@fastify/secure-session'
import { todoController } from '@/controller/todoController'
import { userController } from '@/controller/userController'
import fastifyBcrypt from 'fastify-bcrypt'
import fs from 'node:fs'
import path from 'node:path'

const fastify = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})

fastify.register(fastifyBcrypt, { saltWorkFactor: 10 })

fastify.register(secureSession, {
  sessionName: 'session',
  cookieName: 'userNo',
  key: fs.readFileSync(path.join(process.cwd(), 'secret-key')),
  expiry: 24 * 60 * 60,
  cookie: {
    path: '/'
    // //httpOnly: true,
    // secure: false,
    // sameSite: 'lax'
  }
})

fastify.register(userController)
fastify.register(todoController)

try {
  await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
