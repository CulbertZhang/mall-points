import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import routes from './routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1', routes)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`)
  console.log(`📡 API base: http://localhost:${config.port}/api/v1`)
})

export default app
