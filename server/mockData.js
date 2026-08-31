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

export const overviewData = {
  metrics: [
    { label: 'Fleet available', value: String(initialVehicles.filter((vehicle) => vehicle.status === 'available').length), delta: '+8% vs last week', tone: 'success' },
    { label: 'Active rentals', value: String(initialBookings.filter((booking) => booking.status === 'confirmed').length), delta: '12 due today', tone: 'info' },
    { label: 'Pending returns', value: '2', delta: '4 overdue', tone: 'warning' },
    { label: 'Revenue', value: '$600', delta: '+18.2% this month', tone: 'highlight' },
  ],
  navItems: ['Overview', 'Fleet', 'Bookings', 'Customers', 'Payments', 'Maintenance', 'Reports'],
  fleet: initialVehicles,
  bookings: initialBookings,
  maintenance: [
    { vehicle: 'V-3047', issue: 'Brake inspection', priority: 'High', eta: 'Today' },
    { vehicle: 'V-2009', issue: 'Oil change', priority: 'Medium', eta: 'Tomorrow' },
    { vehicle: 'V-1194', issue: 'Tire rotation', priority: 'Low', eta: 'Thu' },
  ],
  customerMix: [
    { label: 'Business', value: 46 },
    { label: 'Leisure', value: 31 },
    { label: 'Corporate', value: 23 },
  ],
  revenueTrend: [42, 48, 44, 58, 62, 67, 75],
  alerts: [
    '3 vehicles need inspection before next shift',
    '2 bookings have deposits still pending',
    'One late return reported after 5:30 PM',
  ],
}

export const fleetData = initialVehicles
export const bookingData = initialBookings
export const maintenanceData = overviewData.maintenance
