# Vehicle Rent Management System Plan

## 1. Product goal
Build a modern vehicle rental management platform for tracking fleet inventory, bookings, clients, payments, maintenance, and returns. The system should help staff manage daily operations efficiently while giving managers clear analytics and status visibility.

## 2. Core user roles
- Admin / manager: overview dashboard, fleet status, bookings, analytics, user management
- Front desk / operations staff: create bookings, assign vehicles, confirm returns, track payments
- Customer / renter: view available vehicles, create rental request, confirm booking details

## 3. Functional modules
### Fleet management
- Add/edit/delete vehicles
- Categorize by type: car, SUV, van, truck, luxury
- Track availability, status (available, rented, maintenance, inactive)
- Store mileage, fuel level, insurance, and registration details

### Booking management
- Create reservation requests
- Assign vehicle to reservation
- Handle pickup and return dates
- Calculate rental pricing based on duration and vehicle category
- Prevent double-booking of a vehicle

### Customer management
- Store customer profiles and KYC details
- Track rental history and outstanding balances
- Manage preferred vehicles and contact info

### Payments and invoicing
- Track deposits, dues, damages, and extras
- Generate invoice summary for each booking
- Log payment status: pending, paid, overdue

### Maintenance and inspections
- Register maintenance schedules
- Track inspection status before/after rental
- Record repair costs and downtime

### Dashboard and analytics
- Total active rentals
- Revenue trends by day/month
- Top rented vehicles
- Fleet utilization
- Overdue bookings and maintenance alerts

## 4. Technical stack
- Frontend: React + Vite + Tailwind CSS for modern UI
- Backend API: Node.js + Express (or a light REST API layer)
- Database: PostgreSQL
- ORM: Prisma or Sequelize for database access
- State management: React context or Zustand
- Validation: Joi / Zod
- Authentication: JWT-based auth with role-based access control

## 5. Suggested app structure
- frontend/: React dashboard and landing pages
- backend/: Express API and business logic
- database/: PostgreSQL migration/schema scripts
- docs/: project documents, ERD notes, API notes
- .env.example: environment configuration

## 6. Database schema plan
### Tables
- users
- customers
- vehicles
- vehicle_categories
- bookings
- booking_status_history
- payments
- maintenance_records
- inspections
- invoices
- notifications

### Key relationships
- One vehicle belongs to one category
- One customer can have many bookings
- One booking can have many payments and many status events
- One vehicle can have many maintenance and inspection records

## 7. UX / UI plan
- Clean dashboard with neutral base colors and strong contrast
- Modern card-based layout with clear spacing and hierarchy
- Clear status badges for bookings, vehicles, and payments
- Minimal but polished typography and responsive layout
- Standard operations-focused components: tables, summary cards, filters, forms, modals

## 8. Sprint plan
### Phase 1 – foundation
- Set up React app and styling system
- Create project structure and routes
- Define PostgreSQL schema and seed data

### Phase 2 – core booking flow
- Customer list and vehicle listing
- New booking form
- Booking validation and assignment logic

### Phase 3 – operational tooling
- Payment tracking
- Maintenance and inspection flows
- Return/late fee handling

### Phase 4 – analytics dashboard
- KPI cards
- Revenue and vehicle utilization charts
- Alerts and reports

### Phase 5 – polish and launch prep
- Responsive design fixes
- Bug testing
- Final deployment notes and demo assets

## 9. Risks and mitigations
- Double booking risk: enforce unique active booking checks in backend logic
- Data integrity risk: use PostgreSQL foreign keys and constrained enums
- Poor UX: keep interface modular and focused on daily operations
- Scope creep: prioritize essential rental operations before advanced reporting

## 10. Execution checklist
- [ ] Scaffold React app
- [ ] Add project structure and base styling
- [ ] Create PostgreSQL schema and seed data
- [ ] Build dashboard and fleet screens
- [ ] Build booking management workflow
- [ ] Add maintenance and payment sections
- [ ] Add analytics and filters
- [ ] Validate responsive UI and basic interactions

## 11. Definition of done
The hackathon project should demonstrate a complete rental workflow from vehicle inventory through booking, payment, return, and service tracking in a polished, modern interface backed by a PostgreSQL schema.
