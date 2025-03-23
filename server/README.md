
# IndiaRail Backend

This is the backend server for the IndiaRail application.

## Database Schema

```
users
- id (PK)
- name
- email (unique)
- password (hashed)
- role (user/admin)
- created_at

trains
- id (PK)
- name
- number
- from_station
- to_station
- departure
- arrival
- duration
- type
- price
- availability
- rating

train_classes
- id (PK)
- train_id (FK)
- class

train_amenities
- id (PK)
- train_id (FK)
- amenity

tickets
- id (PK)
- user_id (FK)
- train_id (FK)
- journey_date
- booking_date
- class
- status
- total_amount

passengers
- id (PK)
- ticket_id (FK)
- name
- age
- gender
```

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login user or admin

### Trains
- GET /api/trains - Get all trains
- GET /api/trains/:id - Get train by ID

### Tickets
- POST /api/tickets - Book a new ticket
- GET /api/tickets - Get all tickets for logged in user
- GET /api/tickets/:id - Get ticket by ID
- PUT /api/tickets/:id/cancel - Cancel a ticket

### Admin
- GET /api/admin/dashboard - Get admin dashboard data

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=indiarail
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

3. Start the server:
   ```
   npm run dev
   ```

4. The server will automatically create the database tables and seed initial data.

## Development

- The database will be automatically initialized with sample data.
- Default admin user: admin@indiarail.com (password: admin123)
- Default regular user: user@example.com (password: user123)
