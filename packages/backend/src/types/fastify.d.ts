import '@fastify/mysql'
import '@fastify/secure-session'

// if you passed promise = true
declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}
declare module '@fastify/secure-session' {
  interface SessionData {
    userNo: number
  }
}
