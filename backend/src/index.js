import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db/db.js'
import authRoutes from './routes/auth.routes.js'
import productosRoutes from './routes/productos.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`)
  })
})