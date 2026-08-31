export const initialUsers = [
  { id: 'u-101', name: 'Alicia Brooks', email: 'staff@driveflow.com', password: 'staff123', role: 'staff' },
  { id: 'u-102', name: 'Mason Lee', email: 'customer@driveflow.com', password: 'customer123', role: 'customer' },
]

export const initialVehicles = [
  { id: 'V-2041', name: 'Toyota RAV4', type: 'SUV', status: 'available', rate: 72, seats: 5, fuel: 'Hybrid' },
  { id: 'V-1188', name: 'Tesla Model 3', type: 'Electric', status: 'booked', rate: 96, seats: 5, fuel: 'Electric' },
  { id: 'V-3047', name: 'Mercedes Sprinter', type: 'Van', status: 'maintenance', rate: 110, seats: 8, fuel: 'Diesel' },
  { id: 'V-2012', name: 'BMW 5 Series', type: 'Premium', status: 'available', rate: 150, seats: 5, fuel: 'Petrol' },
  { id: 'V-9904', name: 'Ford Transit', type: 'Van', status: 'available', rate: 120, seats: 8, fuel: 'Diesel' },
]

export const initialBookings = [
  { id: 'BK-1001', customerName: 'Nora Smith', vehicleId: 'V-2041', pickupDate: '2026-09-01', returnDate: '2026-09-04', total: 216, status: 'confirmed' },
  { id: 'BK-1002', customerName: 'Daniel Kim', vehicleId: 'V-1188', pickupDate: '2026-09-02', returnDate: '2026-09-06', total: 384, status: 'confirmed' },
]
