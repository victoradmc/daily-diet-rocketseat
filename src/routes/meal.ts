import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto, { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionId } from '../middlewares/session-id'

export async function mealRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req, rep) => {
    console.log('-----------New Request-----------')
    console.log(`[${req.method}] ${req.url}`)
    console.log(`[ CLIENT INFO ] ${req.hostname} | ${req.ip}`)
  })

  app.get('/allMeals', { preHandler: [checkSessionId] }, async (req) => {
    const { sessionId } = req.cookies

    const meals = await knex('meals').where('session_id', sessionId)

    return { meals }
  })

  app.get('/:id', { preHandler: [checkSessionId] }, async (req) => {
    const { sessionId } = req.cookies

    const getMealParamSchema = z.object({
      id: z.string().uuid(),
    }) // define the schema for id

    const { id } = getMealParamSchema.parse(req.params) // actually gets the id from params in the schema format

    const meal = await knex('meals')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return { meal }
  })

  app.post('/', async (req, rep) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet_compliant: z.boolean(),
    })

    const { name, description, diet_compliant } = createMealBodySchema.parse(
      req.body,
    )

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      rep.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      diet_compliant,
      session_id: sessionId,
    })

    return rep.status(201).send()
  })
}
