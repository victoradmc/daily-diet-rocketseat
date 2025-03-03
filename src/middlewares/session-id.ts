import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionId(req: FastifyRequest, rep: FastifyReply) {
  const sessionId = req.cookies.sessionId
  if (!sessionId) {
    return rep.status(401).send({
      error: 'Unauthorized, please authenticate',
    })
  }
}
