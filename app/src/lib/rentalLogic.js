const USERS = [
  { email: 'staff@driveflow.com', password: 'staff123', role: 'staff', name: 'Alicia Brooks' },
  { email: 'customer@driveflow.com', password: 'customer123', role: 'customer', name: 'Mason Lee' },
]

export function authenticateUser({ email, password }) {
  const user = USERS.find(
    (entry) => entry.email.toLowerCase() === String(email).toLowerCase() && entry.password === password,
  )

  if (!user) {
    return null
  }

  return { email: user.email, role: user.role, name: user.name }
}

export function getAvailableVehicles(vehicles) {
  return vehicles.filter((vehicle) => vehicle.status === 'available')
}

export function createBooking({ vehicles, bookings, vehicleId, customerName, pickupDate, returnDate }) {
  const vehicle = vehicles.find((item) => item.id === vehicleId)

  if (!vehicle) {
    return { success: false, error: 'Vehicle not found.' }
  }

  if (vehicle.status !== 'available') {
    return { success: false, error: 'Selected vehicle is not available.' }
  }

  const start = new Date(pickupDate)
  const end = new Date(returnDate)
  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  const total = days * Number(vehicle.rate)

  const updatedVehicles = vehicles.map((item) =>
    item.id === vehicleId ? { ...item, status: 'booked' } : item,
  )

  const newBooking = {
    id: `BK-${Date.now()}`,
    customerName,
    vehicleId,
    pickupDate,
    returnDate,
    total,
    status: 'confirmed',
  }

  return {
    success: true,
    booking: newBooking,
    vehicles: updatedVehicles,
    bookings: [...bookings, newBooking],
  }
}
