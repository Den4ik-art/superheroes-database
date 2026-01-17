# Superhero Database

Full-stack app for managing a superhero catalog with a real database, image uploads, and fast search.

## Requirements

- Node.js 18+
- npm 9+
- MongoDB 6+ (local or Atlas)

## Setup

### Backend

```
cd backend
npm install
npm run dev
```

Create `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/superheroes_db
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Features

- CRUD for superheroes
- Card-based list with flip on click
- Pagination (5 heroes per page)
- Details page with full information and image gallery
- Image upload and removal
- Quick search by nickname or real name
- Loading states with animated spinner during DB fetches

## Assumptions

- Images are stored on the backend file system in `backend/uploads`.
- Card flip is click/tap based for mobile friendliness.
- Edit and delete actions are available on the details page.

## Tests

Backend unit tests cover repository/service logic for search and pagination.

```
cd backend
npm test
```
