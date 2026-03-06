# 🎬 Cinema API

A RESTful API for the Cinema booking app, built with Express, Prisma, SQLite, and TypeScript — mirroring the structure of the social-api project.

## Tech Stack

- **Runtime**: Node.js + TypeScript (via `tsx`)
- **Framework**: Express 5
- **ORM**: Prisma 7 (SQLite via better-sqlite3)
- **Auth**: JWT + bcryptjs
- **Dev tools**: @faker-js/faker for seeding

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed the database
npm run seed

# 5. Start dev server
npm run dev
```

Server starts on **http://localhost:3001**

---

## Environment Variables (`.env`)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
```

---

## API Endpoints

### 🔐 Auth

| Method | Endpoint         | Auth | Description             |
|--------|------------------|------|-------------------------|
| POST   | /api/auth/register | —  | Register a new user     |
| POST   | /api/auth/login    | —  | Login, returns JWT      |
| GET    | /api/auth/me       | ✅ | Get current user info   |

**Register / Login body:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```

---

### 🎥 Movies

| Method | Endpoint              | Auth  | Description                         |
|--------|-----------------------|-------|-------------------------------------|
| GET    | /api/movies           | —     | List all active movies              |
| GET    | /api/movies/:id       | —     | Movie detail + upcoming showtimes   |
| GET    | /api/movies/genres/list | —   | All distinct genres                 |
| POST   | /api/movies           | Admin | Create a movie                      |
| PUT    | /api/movies/:id       | Admin | Update a movie                      |
| DELETE | /api/movies/:id       | Admin | Soft-delete (deactivate) a movie    |

**Query params for GET /api/movies:**
- `genre=Action`
- `search=inter`
- `active=false` (include inactive)

---

### 🕐 Showtimes

| Method | Endpoint             | Auth  | Description                              |
|--------|----------------------|-------|------------------------------------------|
| GET    | /api/showtimes       | —     | List showtimes (filter by movie/date/format) |
| GET    | /api/showtimes/:id   | —     | Showtime detail with seat availability   |
| POST   | /api/showtimes       | Admin | Create a showtime                        |
| DELETE | /api/showtimes/:id   | Admin | Cancel a showtime                        |

**Query params for GET /api/showtimes:**
- `movieId=1`
- `date=2026-02-26`
- `format=IMAX`

---

### 💺 Seats

| Method | Endpoint                         | Auth | Description                          |
|--------|----------------------------------|------|--------------------------------------|
| GET    | /api/seats/showtime/:showtimeId  | —    | 2D seat grid map with booking status |

**Response includes a `grid` array** — rows of seats each with `id`, `row`, `col`, `type` (STANDARD/VIP/WHEELCHAIR), `isBooked`, `price`.

---

### 🎟️ Bookings

| Method | Endpoint                  | Auth  | Description                        |
|--------|---------------------------|-------|------------------------------------|
| GET    | /api/bookings             | ✅    | User's own bookings (admin: all)   |
| GET    | /api/bookings/:id         | ✅    | Single booking detail              |
| POST   | /api/bookings             | ✅    | Create a booking (seats reserved)  |
| POST   | /api/bookings/:id/confirm | ✅    | Confirm payment → CONFIRMED status |
| DELETE | /api/bookings/:id         | ✅    | Cancel a booking                   |

**Create booking body:**
```json
{
  "showtimeId": 1,
  "seatIds": [12, 13]
}
```

**Booking statuses:** `PENDING` → `CONFIRMED` | `CANCELLED`

---

### 🏛️ Cinemas

| Method | Endpoint       | Auth  | Description               |
|--------|----------------|-------|---------------------------|
| GET    | /api/cinemas   | —     | List all cinemas          |
| GET    | /api/cinemas/:id | —   | Cinema with halls & shows |
| POST   | /api/cinemas   | Admin | Create a cinema           |

---

## Data Models

```
User → Booking → BookedSeat → Seat → Hall → Cinema
Movie → Showtime → Booking
Showtime → Hall
```

## Seeded Data

After `npm run seed`:
- 1 Admin: `admin@cinema.com` / `password123`
- 5 regular users
- 1 cinema with 2 halls (Hall A: 80 seats, Hall B IMAX: 120 seats)
- 5 movies across different genres
- ~100 showtimes over the next 7 days (2D, 3D, IMAX)
- 2 sample confirmed bookings
