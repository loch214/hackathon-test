const data = {
  metrics: [
    { label: 'Fleet available', value: '52', delta: '+8% vs last week', tone: 'success' },
    { label: 'Active rentals', value: '38', delta: '12 due today', tone: 'info' },
    { label: 'Pending returns', value: '12', delta: '4 overdue', tone: 'warning' },
    { label: 'Revenue', value: '$48.4k', delta: '+18.2% this month', tone: 'highlight' },
  ],
  navItems: ['Overview', 'Fleet', 'Bookings', 'Customers', 'Payments', 'Maintenance', 'Reports'],
  fleet: [
    { id: 'V-2041', type: 'SUV', status: 'Available', mileage: '12,440 km', rate: '$72/day', driver: 'Self-drive' },
    { id: 'V-1188', type: 'Electric', status: 'Booked', mileage: '8,930 km', rate: '$96/day', driver: 'Driver included' },
    { id: 'V-3047', type: 'Van', status: 'Maintenance', mileage: '23,140 km', rate: '$110/day', driver: 'Crew van' },
    { id: 'V-2012', type: 'Premium', status: 'Available', mileage: '6,420 km', rate: '$150/day', driver: 'Executive' },
  ],
  bookings: [
    { id: 'BK-4812', client: 'Nora Smith', vehicle: 'V-2041', dates: 'Aug 31 - Sep 02', total: '$234', status: 'Confirmed' },
    { id: 'BK-4818', client: 'Daniel Kim', vehicle: 'V-1188', dates: 'Sep 01 - Sep 05', total: '$480', status: 'Pickup scheduled' },
    { id: 'BK-4827', client: 'Maya Patel', vehicle: 'V-2012', dates: 'Sep 03 - Sep 06', total: '$420', status: 'Pending payment' },
    { id: 'BK-4831', client: 'Lucas Reed', vehicle: 'V-3320', dates: 'Sep 02 - Sep 04', total: '$310', status: 'Review' },
  ],
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

export default data
