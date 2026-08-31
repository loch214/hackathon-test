import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { overviewData, fleetData, bookingData, maintenanceData } from './mockData.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'vehicle-rent-server',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/overview', (req, res) => {
  res.json(overviewData)
})

app.get('/api/fleet', (req, res) => {
  res.json(fleetData)
})

app.get('/api/bookings', (req, res) => {
  res.json(bookingData)
})

app.get('/api/maintenance', (req, res) => {
  res.json(maintenanceData)
})

app.listen(port, () => {
  console.log(`Vehicle rent API running on http://localhost:${port}`)
})
