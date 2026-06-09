import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './routes/auth.js'
import carsRouter from './routes/cars.js'
import maintenancesRouter from './routes/maintenances.js'
import pdfRouter from './routes/pdf.js'
import intervalsRouter from './routes/intervals.js'
import { authenticate } from './middleware/authenticate.js'
import { startNotificationCron } from './services/notificationService.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Public routes
app.use('/api/auth', authRouter)

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Protected routes — all require valid JWT
app.use(authenticate)
app.use('/api/cars', carsRouter)
app.use('/api/maintenances', maintenancesRouter)
app.use('/api/intervals', intervalsRouter)
app.use('/api', pdfRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'El archivo supera el tamaño máximo de 5MB' })
  }
  res.status(500).json({ error: err.message || 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`[Server] Corriendo en http://localhost:${PORT}`)
  startNotificationCron()
})
