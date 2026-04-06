import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db/db.js'
import authRoutes from './routes/auth.routes.js'
import productosRoutes from './routes/productos.routes.js'
import { notFound as notFoundResponse, serverError } from './utils/httpResponse.js'
import ordenesRoutes from './routes/ordenes.routes.js'
import chatRoutes from './routes/chat.routes.js'
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dotenv.config()
// Reloading dotenv

const app = express()
app.set('trust proxy', 1); // para que funcione el rate limit con proxy railway
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://trafficandy.up.railway.app'],
  })
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/ordenes', ordenesRoutes)
app.use('/api/chat', chatRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server corriendo en http://localhost:${PORT}`)
  })
})

// 404 - Ruta no encontrada
app.use((req, res) => {
  notFoundResponse(res, 'Ruta no encontrada')
})

// 500 - Error interno del servidor
app.use((err, req, res, next) => {
  serverError(res, 'Error interno del servidor', err)
})