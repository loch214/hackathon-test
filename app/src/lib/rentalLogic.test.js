import { describe, expect, it } from 'vitest'
import { authenticateUser, createBooking, getAvailableVehicles, getDemoCredentials } from './rentalLogic'

describe('rentalLogic', () => {
  it('authenticates a staff account with valid credentials', () => {
    const user = authenticateUser({ email: 'staff@driveflow.com', password: 'staff123' })

    expect(user).toMatchObject({ role: 'staff', name: 'Alicia Brooks' })
  })

  it('returns only available vehicles', () => {
    const vehicles = [
      { id: 'V-1', status: 'available', rate: 80 },
      { id: 'V-2', status: 'booked', rate: 90 },
      { id: 'V-3', status: 'maintenance', rate: 70 },
    ]

    expect(getAvailableVehicles(vehicles).map((vehicle) => vehicle.id)).toEqual(['V-1'])
  })

  it('provides the default demo credentials for each role', () => {
    expect(getDemoCredentials('staff')).toEqual({
      email: 'staff@driveflow.com',
      password: 'staff123',
    })

    expect(getDemoCredentials('customer')).toEqual({
      email: 'customer@driveflow.com',
      password: 'customer123',
    })
  })

  it('creates a booking for an available vehicle and calculates total', () => {
    const vehicles = [
      { id: 'V-10', status: 'available', rate: 120 },
    ]

    const result = createBooking({
      vehicles,
      bookings: [],
      vehicleId: 'V-10',
      customerName: 'Test User',
      pickupDate: '2026-09-02',
      returnDate: '2026-09-05',
    })

    expect(result.success).toBe(true)
    expect(result.booking.total).toBe(360)
    expect(result.vehicles[0].status).toBe('booked')
  })

  it('blocks booking when a vehicle is not available', () => {
    const vehicles = [{ id: 'V-11', status: 'booked', rate: 100 }]

    const result = createBooking({
      vehicles,
      bookings: [],
      vehicleId: 'V-11',
      customerName: 'Test User',
      pickupDate: '2026-09-02',
      returnDate: '2026-09-05',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('not available')
  })
})
