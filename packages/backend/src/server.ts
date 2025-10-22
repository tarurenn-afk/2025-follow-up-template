import Fastify from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { sampleController } from '@/controller/backController'

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyCors, { origin: '*' })

fastify.register(sampleController)

try {
  await fastify.listen({ port: 8000, host: '0.0.0.0' })
} catch (error) {
  fastify.log.error(error)
  process.exit(1)
}
