import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { initialUsers, initialVehicles, initialBookings } from './appData'
import { authenticateUser, createBooking, getAvailableVehicles } from './lib/rentalLogic'

const storageKey = 'driveflow-rental-state-v1'

const statusClassMap = {
  available: 'status success',
  booked: 'status info',
  maintenance: 'status warning',
  confirmed: 'status success',
  completed: 'status neutral',
}

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`

function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return initialUsers

    try {
      const parsed = JSON.parse(saved)
      return parsed.users || initialUsers
    } catch {
      return initialUsers
    }
  })

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return initialVehicles

    try {
      const parsed = JSON.parse(saved)
      return parsed.vehicles || initialVehicles
    } catch {
      return initialVehicles
    }
  })

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return initialBookings

    try {
      const parsed = JSON.parse(saved)
      return parsed.bookings || initialBookings
    } catch {
      return initialBookings
    }
  })

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return null

    try {
      const parsed = JSON.parse(saved)
      return parsed.currentUser || null
    } catch {
      return null
    }
  })

  const [loginForm, setLoginForm] = useState({ email: 'staff@driveflow.com', password: 'staff123' })
  const [loginError, setLoginError] = useState('')
  const [flashMessage, setFlashMessage] = useState('Welcome back')
  const [activeView, setActiveView] = useState('overview')
  const [bookingForm, setBookingForm] = useState({
    vehicleId: 'V-2041',
    pickupDate: '2026-09-03',
    returnDate: '2026-09-07',
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ users, vehicles, bookings, currentUser }))
  }, [users, vehicles, bookings, currentUser])

  const availableVehicles = useMemo(() => getAvailableVehicles(vehicles), [vehicles])
  const staffMetrics = useMemo(() => {
    const availableCount = vehicles.filter((vehicle) => vehicle.status === 'available').length
    const bookedCount = vehicles.filter((vehicle) => vehicle.status === 'booked').length
    const revenue = bookings.reduce((total, booking) => total + Number(booking.total || 0), 0)

    return [
      { label: 'Available fleet', value: String(availableCount), delta: '+12% this week', tone: 'success' },
      { label: 'Booked now', value: String(bookedCount), delta: '5 due today', tone: 'info' },
      { label: 'Revenue', value: formatCurrency(revenue), delta: '+18.4% month to date', tone: 'highlight' },
      { label: 'Open bookings', value: String(bookings.length), delta: '2 pending review', tone: 'warning' },
    ]
  }, [vehicles, bookings])

  const customerBookings = useMemo(
    () => bookings.filter((booking) => booking.customerName === currentUser?.name),
    [bookings, currentUser],
  )

  const vehicleNameMap = useMemo(
    () => Object.fromEntries(vehicles.map((vehicle) => [vehicle.id, vehicle.name])),
    [vehicles],
  )

  function handleLogin(event) {
    event.preventDefault()

    const user = authenticateUser(loginForm)
    if (!user) {
      setLoginError('Invalid email or password. Try staff@driveflow.com / staff123')
      return
    }

    setCurrentUser(user)
    setLoginError('')
    setFlashMessage(`${user.name} logged in successfully.`)
    setActiveView('overview')
  }

  function handleLogout() {
    setCurrentUser(null)
    setFlashMessage('You have been logged out.')
  }

  function handleReserveVehicle(vehicleId) {
    if (!currentUser) return

    const result = createBooking({
      vehicles,
      bookings,
      vehicleId,
      customerName: currentUser.name,
      pickupDate: '2026-09-05',
      returnDate: '2026-09-09',
    })

    if (!result.success) {
      setFlashMessage(result.error)
      return
    }

    setVehicles(result.vehicles)
    setBookings(result.bookings)
    setFlashMessage(`Reservation created for ${vehicleNameMap[vehicleId]}.`)
  }

  function handleStaffBookingSubmit(event) {
    event.preventDefault()

    const result = createBooking({
      vehicles,
      bookings,
      vehicleId: bookingForm.vehicleId,
      customerName: 'Walk-in customer',
      pickupDate: bookingForm.pickupDate,
      returnDate: bookingForm.returnDate,
    })

    if (!result.success) {
      setFlashMessage(result.error)
      return
    }

    setVehicles(result.vehicles)
    setBookings(result.bookings)
    setFlashMessage(`Booking ${result.booking.id} created successfully.`)
  }

  function handleReturnBooking(bookingId) {
    const targetBooking = bookings.find((booking) => booking.id === bookingId)
    if (!targetBooking) return

    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === bookingId ? { ...booking, status: 'completed' } : booking,
      ),
    )

    setVehicles((previous) =>
      previous.map((vehicle) =>
        vehicle.id === targetBooking.vehicleId ? { ...vehicle, status: 'available' } : vehicle,
      ),
    )

    setFlashMessage(`Vehicle ${targetBooking.vehicleId} marked as returned.`)
  }

  if (!currentUser) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-badge">VR</div>
            <div>
              <p className="eyebrow">Fleet management</p>
              <h1>DriveFlow</h1>
            </div>
          </div>

          <div className="auth-intro">
            <h2>Access your rental workspace</h2>
            <p>Manage vehicles, bookings, customers, and returns in one operational dashboard.</p>
          </div>

          <div className="role-grid">
            <div className="role-pill active">
              <span>Staff</span>
              <small>Operations</small>
            </div>
            <div className="role-pill">
              <span>Customer</span>
              <small>Bookings</small>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                placeholder="staff@driveflow.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                placeholder="••••••••"
              />
            </label>

            {loginError ? <div className="error-banner">{loginError}</div> : null}

            <button type="submit" className="primary-btn wide-btn">Log in</button>
          </form>

          <div className="demo-box">
            <strong>Demo credentials</strong>
            <p>Staff: staff@driveflow.com / staff123</p>
            <p>Customer: customer@driveflow.com / customer123</p>
          </div>
        </div>
      </div>
    )
  }

  const dashboardCards = currentUser.role === 'staff' ? staffMetrics : [
    { label: 'Upcoming rentals', value: String(customerBookings.length), delta: 'Based on your profile', tone: 'info' },
    { label: 'Available cars', value: String(availableVehicles.length), delta: 'Ready to reserve', tone: 'success' },
    { label: 'Total spend', value: formatCurrency(customerBookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0)), delta: 'This year', tone: 'highlight' },
    { label: 'Status', value: 'Active', delta: 'Profile verified', tone: 'success' },
  ]

  const renderStaffOverview = () => (
    <>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Live status</p>
          <h2>Today’s fleet pulse</h2>
        </div>

        <div className="hero-stats">
          <div>
            <strong>{vehicles.filter((vehicle) => vehicle.status === 'available').length}</strong>
            <span>Cars ready</span>
          </div>
          <div>
            <strong>{bookings.filter((booking) => booking.status === 'confirmed').length}</strong>
            <span>Active rentals</span>
          </div>
          <div>
            <strong>{bookings.filter((booking) => booking.status === 'completed').length}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      <section className="metrics-grid">
        {dashboardCards.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-label-row">
              <span className="small-label">{metric.label}</span>
              <span className={`metric-pill ${metric.tone}`}>{metric.delta}</span>
            </div>
            <div className="metric-value">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Fleet overview</p>
              <h3>Vehicle status</h3>
            </div>
          </div>

          <div className="fleet-list">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="fleet-row">
                <div className="fleet-main">
                  <div className="vehicle-icon">{vehicle.type.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <strong>{vehicle.name}</strong>
                    <p>{vehicle.type} · {vehicle.seats} seats</p>
                  </div>
                </div>

                <div className="fleet-meta">
                  <span>{vehicle.fuel}</span>
                  <span>{vehicle.rate}/day</span>
                </div>

                <span className={statusClassMap[vehicle.status] || 'status neutral'}>{vehicle.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Quick action</p>
              <h3>Create booking</h3>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleStaffBookingSubmit}>
            <label>
              Vehicle
              <select
                value={bookingForm.vehicleId}
                onChange={(event) => setBookingForm({ ...bookingForm, vehicleId: event.target.value })}
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="split-fields">
              <label>
                Pickup
                <input
                  type="date"
                  value={bookingForm.pickupDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, pickupDate: event.target.value })}
                />
              </label>

              <label>
                Return
                <input
                  type="date"
                  value={bookingForm.returnDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, returnDate: event.target.value })}
                />
              </label>
            </div>

            <button type="submit" className="primary-btn wide-btn">Create reservation</button>
          </form>
        </div>
      </section>

      <section className="lower-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Bookings</p>
              <h3>Recent rentals</h3>
            </div>
          </div>

          <div className="booking-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-head">
                  <strong>{booking.id}</strong>
                  <span className={statusClassMap[booking.status] || 'status neutral'}>{booking.status}</span>
                </div>

                <p>{booking.customerName}</p>
                <small>{vehicleNameMap[booking.vehicleId]} · {booking.pickupDate} to {booking.returnDate}</small>

                <div className="booking-footer">
                  <strong>{formatCurrency(booking.total)}</strong>
                  {booking.status === 'confirmed' ? (
                    <button type="button" className="ghost-btn small-btn" onClick={() => handleReturnBooking(booking.id)}>
                      Mark return
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Focus</p>
              <h3>Operational alerts</h3>
            </div>
          </div>

          <ul className="alert-list">
            <li>3 vehicles need inspection before next shift.</li>
            <li>2 reservations require payment confirmation.</li>
            <li>One vehicle is overdue for service.</li>
          </ul>
        </div>
      </section>
    </>
  )

  const renderStaffFleet = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Fleet management</p>
            <h3>Vehicle catalog</h3>
          </div>
          <button type="button" className="primary-btn">Add vehicle</button>
        </div>

        <div className="table-panel">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="list-row">
              <div className="list-main">
                <div className="vehicle-icon">{vehicle.type.slice(0, 2).toUpperCase()}</div>
                <div>
                  <strong>{vehicle.name}</strong>
                  <small>{vehicle.id}</small>
                </div>
              </div>
              <span>{vehicle.type}</span>
              <span>{vehicle.fuel}</span>
              <span>{vehicle.seats} seats</span>
              <span>{formatCurrency(vehicle.rate)}/day</span>
              <span className={statusClassMap[vehicle.status] || 'status neutral'}>{vehicle.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderStaffBookings = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Reservations</p>
            <h3>Booking control</h3>
          </div>
        </div>

        <div className="table-panel">
          {bookings.map((booking) => (
            <div key={booking.id} className="list-row booking-row">
              <div>
                <strong>{booking.id}</strong>
                <small>{booking.customerName}</small>
              </div>
              <span>{vehicleNameMap[booking.vehicleId]}</span>
              <span>{booking.pickupDate}</span>
              <span>{booking.returnDate}</span>
              <strong>{formatCurrency(booking.total)}</strong>
              <span className={statusClassMap[booking.status] || 'status neutral'}>{booking.status}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderStaffMaintenance = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Maintenance</p>
            <h3>Service schedule</h3>
          </div>
          <button type="button" className="primary-btn">Schedule check</button>
        </div>

        <div className="maintenance-grid">
          <div className="maintenance-card danger">
            <strong>Brake inspection</strong>
            <span>Vehicle V-3047</span>
            <small>High priority · Today</small>
          </div>
          <div className="maintenance-card warning">
            <strong>Oil change</strong>
            <span>Vehicle V-2009</span>
            <small>Medium priority · Tomorrow</small>
          </div>
          <div className="maintenance-card okay">
            <strong>Tire rotation</strong>
            <span>Vehicle V-1194</span>
            <small>Low priority · Thu</small>
          </div>
        </div>
      </div>
    </section>
  )

  const renderCustomerOverview = () => (
    <>
      <section className="customer-hero">
        <div>
          <p className="eyebrow">Your account</p>
          <h2>Book a vehicle in minutes</h2>
        </div>

        <div className="hero-badge">Profile verified</div>
      </section>

      <section className="metrics-grid">
        {dashboardCards.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-label-row">
              <span className="small-label">{metric.label}</span>
              <span className={`metric-pill ${metric.tone}`}>{metric.delta}</span>
            </div>
            <div className="metric-value">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Recommended</p>
              <h3>Popular picks</h3>
            </div>
          </div>

          <div className="vehicle-grid">
            {availableVehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-card-top">
                  <div>
                    <strong>{vehicle.name}</strong>
                    <small>{vehicle.type}</small>
                  </div>
                  <span className="status success">Available</span>
                </div>

                <div className="vehicle-specs">
                  <span>{vehicle.seats} seats</span>
                  <span>{vehicle.fuel}</span>
                </div>

                <div className="vehicle-price-row">
                  <strong>{formatCurrency(vehicle.rate)}</strong>
                  <span>/day</span>
                </div>

                <button type="button" className="primary-btn wide-btn" onClick={() => handleReserveVehicle(vehicle.id)}>
                  Reserve this car
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Timeline</p>
              <h3>Upcoming travel</h3>
            </div>
          </div>

          <div className="booking-list">
            {customerBookings.length === 0 ? (
              <div className="empty-state">No active bookings yet.</div>
            ) : (
              customerBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-head">
                    <strong>{booking.id}</strong>
                    <span className={statusClassMap[booking.status] || 'status neutral'}>{booking.status}</span>
                  </div>
                  <p>{vehicleNameMap[booking.vehicleId]}</p>
                  <small>{booking.pickupDate} to {booking.returnDate}</small>
                  <div className="booking-total">{formatCurrency(booking.total)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )

  const renderCustomerVehicles = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Vehicle catalog</p>
            <h3>Available to reserve</h3>
          </div>
        </div>

        <div className="vehicle-grid">
          {availableVehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="vehicle-card-top">
                <div>
                  <strong>{vehicle.name}</strong>
                  <small>{vehicle.type}</small>
                </div>
                <span className="status success">Open</span>
              </div>

              <div className="vehicle-specs">
                <span>{vehicle.seats} seats</span>
                <span>{vehicle.fuel}</span>
              </div>

              <div className="vehicle-price-row">
                <strong>{formatCurrency(vehicle.rate)}</strong>
                <span>/day</span>
              </div>

              <button type="button" className="primary-btn wide-btn" onClick={() => handleReserveVehicle(vehicle.id)}>
                Reserve now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  const renderCustomerBookings = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">My bookings</p>
            <h3>Rental history & upcoming stays</h3>
          </div>
        </div>

        <div className="booking-list">
          {customerBookings.length === 0 ? (
            <div className="empty-state">No bookings yet. Choose a vehicle to start.</div>
          ) : (
            customerBookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-head">
                  <strong>{booking.id}</strong>
                  <span className={statusClassMap[booking.status] || 'status neutral'}>{booking.status}</span>
                </div>
                <p>{vehicleNameMap[booking.vehicleId]}</p>
                <small>{booking.pickupDate} to {booking.returnDate}</small>
                <div className="booking-total">{formatCurrency(booking.total)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )

  const renderCustomerProfile = () => (
    <section className="page-grid">
      <div className="panel full-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h3>Account details</h3>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="brand-badge small-badge">ML</div>
            <div>
              <strong>{currentUser.name}</strong>
              <small>{currentUser.email}</small>
            </div>
          </div>

          <div className="profile-meta">
            <span>Membership ID: C-1024</span>
            <span>Verified driver</span>
            <span>Preferred vehicle: SUV</span>
          </div>
        </div>
      </div>
    </section>
  )

  const renderStaffContent = () => {
    const viewMap = {
      overview: renderStaffOverview(),
      fleet: renderStaffFleet(),
      bookings: renderStaffBookings(),
      maintenance: renderStaffMaintenance(),
    }

    return viewMap[activeView] || viewMap.overview
  }

  const renderCustomerContent = () => {
    const viewMap = {
      overview: renderCustomerOverview(),
      vehicles: renderCustomerVehicles(),
      'my-rentals': renderCustomerBookings(),
      profile: renderCustomerProfile(),
    }

    return viewMap[activeView] || viewMap.overview
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-badge">VR</div>
          <div>
            <p className="eyebrow">Fleet ops</p>
            <h2>DriveFlow</h2>
          </div>
        </div>

        <div className="user-pill">
          <span>{currentUser.name}</span>
          <small>{currentUser.role}</small>
        </div>

        <nav className="nav">
          {(currentUser.role === 'staff' ? ['Overview', 'Fleet', 'Bookings', 'Maintenance'] : ['Overview', 'Vehicles', 'My rentals', 'Profile']).map((item, index) => {
            const key = item.toLowerCase().replace(/\s+/g, '-')
            return (
              <button
                key={item}
                type="button"
                className={activeView === key && index === 0 || activeView === key ? 'nav-item active' : 'nav-item'}
                onClick={() => setActiveView(key)}
              >
                {item}
              </button>
            )
          })}
        </nav>

        <button type="button" className="logout-btn" onClick={handleLogout}>Log out</button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">{currentUser.role === 'staff' ? 'Operations dashboard' : 'Customer portal'}</p>
            <h1>{currentUser.role === 'staff' ? 'Vehicle rent management' : `Welcome, ${currentUser.name}`}</h1>
          </div>

          <div className="topbar-actions">
            <button type="button" className="ghost-btn">Export</button>
            <button type="button" className="primary-btn">New booking</button>
          </div>
        </header>

        {flashMessage ? <div className="flash-banner">{flashMessage}</div> : null}

        {currentUser.role === 'staff' ? renderStaffContent() : renderCustomerContent()}
      </main>
    </div>
  )
}

export default App
