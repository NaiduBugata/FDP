# Conference Backend API

Production-ready Node.js + Express + MongoDB backend using MVC architecture.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- cors
- express-validator
- bcrypt
- jsonwebtoken

## Environment

Create/update .env in backend root:

- MONGO_URI=<your_mongo_connection>
- PORT=5000
- JWT_SECRET=<strong_secret>
- JWT_EXPIRES_IN=1d
- CORS_ORIGINS=http://localhost:5173,http://localhost:4173
- RATE_LIMIT_MAX=600

Notes:

- `JWT_SECRET` must be at least 32 characters and must not be the placeholder value.
- If `CORS_ORIGINS` is empty, all origins are allowed. Set it in deployment.

## Run

1. npm install
2. npm run dev

or

1. npm install
2. npm start

## Base API URL

http://localhost:5000/api

## Auth Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (Bearer token required)

## Registration Data Protection

- GET /api/registrations (Bearer token + admin role required)
- GET /api/registrations/:id (Bearer token + admin role required)
- GET /api/registrations/export/excel (Bearer token + admin role required)
- POST /api/registrations (public, for participant registration form)

## CRUD Endpoints

- Committees: /api/committees
- Navbars: /api/navbars
- Registrations: /api/registrations
- Schedules: /api/schedules
- Sections: /api/sections
- Speakers: /api/speakers

Each module supports:

- GET /
- GET /:id
- POST /
- PUT /:id
- DELETE /:id

## Load Balancer (Nginx + PM2 Cluster)

1. Start clustered backend instances:

	`pm2 start ecosystem.config.cjs`

2. Use Nginx config file:

	`deploy/nginx-load-balancer.conf`

This routes `/api` traffic to backend instances on ports 5000 and 5001.

## Frontend Integration Example (Axios)

```js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
	baseURL: API_BASE_URL,
})

export const getSpeakers = () => api.get('/speakers')

export const createSpeaker = (payload, token) =>
	api.post('/speakers', payload, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
```

## Frontend Integration Example (Fetch)

```js
const API_BASE_URL = 'http://localhost:5000/api'

export async function getSchedules() {
	const response = await fetch(`${API_BASE_URL}/schedules`)
	if (!response.ok) throw new Error('Failed to fetch schedules')
	return response.json()
}

export async function updateSection(id, payload, token) {
	const response = await fetch(`${API_BASE_URL}/sections/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(payload),
	})
	if (!response.ok) throw new Error('Failed to update section')
	return response.json()
}
```
