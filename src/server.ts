import { app } from './app'
import { env } from './env'

app.listen({ port: env.PORT }).then(() => {
  console.log(`[ START ] Server is running on porn ${env.PORT}`)
})
