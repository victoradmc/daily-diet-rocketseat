import fastify from 'fastify'
import { mealRoutes } from './routes/meal'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(mealRoutes, {
  prefix: '/meal',
})
