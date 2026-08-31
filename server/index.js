import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initialUsers, initialVehicles, initialBookings, overviewData } from './mockData.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

const users = [...initialUsers]
let vehicles = [...initialVehicles]
let bookings = [...initialBookings]

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

function buildOverview() {
  const availableCount = vehicles.filter((vehicle) => vehicle.status === 'available').length
  const confirmedCount = bookings.filter((booking) => booking.status === 'confirmed').length

  return {
    ...overviewData,
    metrics: [
      { label: 'Fleet available', value: String(availableCount), delta: '+8% vs last week', tone: 'success' },
      { label: 'Active rentals', value: String(confirmedCount), delta: '12 due today', tone: 'info' },
      { label: 'Pending returns', value: String(bookings.length), delta: '4 overdue', tone: 'warning' },
      { label: 'Revenue', value: `$${bookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0)}`, delta: '+18.2% this month', tone: 'highlight' },
    ],
    fleet: vehicles,
    bookings,
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'vehicle-rent-server',
    timestamp: new Date().toISOString(),
  })
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = users.find(
    (entry) => entry.email.toLowerCase() === String(email || '').toLowerCase() && entry.password === password,
  )

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

app.get('/api/overview', (req, res) => {
  res.json(buildOverview())
})

app.get('/api/fleet', (req, res) => {
  res.json(vehicles)
})

app.get('/api/vehicles', (req, res) => {
  res.json(vehicles)
})

app.get('/api/bookings', (req, res) => {
  res.json(bookings)
})

app.post('/api/bookings', (req, res) => {
  const { vehicleId, customerName, pickupDate, returnDate } = req.body || {}
  const vehicle = vehicles.find((item) => item.id === vehicleId)

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found.' })
  }

  if (!pickupDate || !returnDate) {
    return res.status(400).json({ message: 'Please choose both dates.' })
  }

  const start = new Date(pickupDate)
  const end = new Date(returnDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return res.status(400).json({ message: 'Return date must be after pickup date.' })
  }

  if (vehicle.status !== 'available') {
    return res.status(409).json({ message: 'Selected vehicle is not available.' })
  }

  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  const total = days * Number(vehicle.rate)

  const newBooking = {
    id: `BK-${Date.now()}`,
    customerName: customerName || 'Walk-in customer',
    vehicleId,
    pickupDate,
    returnDate,
    total,
    status: 'confirmed',
  }

  vehicles = vehicles.map((item) => (item.id === vehicleId ? { ...item, status: 'booked' } : item))
  bookings = [...bookings, newBooking]

  return res.status(201).json({ booking: newBooking, vehicles, bookings })
})

app.post('/api/bookings/:bookingId/return', (req, res) => {
  const { bookingId } = req.params
  const targetBooking = bookings.find((booking) => booking.id === bookingId)

  if (!targetBooking) {
    return res.status(404).json({ message: 'Booking not found.' })
  }

  bookings = bookings.map((booking) =>
    booking.id === bookingId ? { ...booking, status: 'completed' } : booking,
  )

  vehicles = vehicles.map((vehicle) =>
    vehicle.id === targetBooking.vehicleId ? { ...vehicle, status: 'available' } : vehicle,
  )

  return res.json({ booking: bookings.find((booking) => booking.id === bookingId), vehicles, bookings })
})

app.get('/api/maintenance', (req, res) => {
  res.json([
    { vehicle: 'V-3047', issue: 'Brake inspection', priority: 'High', eta: 'Today' },
    { vehicle: 'V-2009', issue: 'Oil change', priority: 'Medium', eta: 'Tomorrow' },
    { vehicle: 'V-1194', issue: 'Tire rotation', priority: 'Low', eta: 'Thu' },
  ])
})

app.listen(port, () => {
  console.log(`Vehicle rent API running on http://localhost:${port}`)
})
