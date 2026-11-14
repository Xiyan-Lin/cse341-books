# CSE 341 — W01 Books Web Service

A read-only REST API built with Node.js, Express, and MongoDB Atlas. Books are retrieved from `cse341-books-db.books`.

## API specification

| Method | Endpoint | Result | HTTP status |
| --- | --- | --- | --- |
| GET | `/books` | JSON array of books (may be empty) | 200 |
| GET | `/books/:id` | One JSON book with the requested `id` | 200 |
| GET | `/books/:id` | `{ "message": "Book not found" }` when missing | 404 |
| GET | either books endpoint | `{ "message": "Internal server error" }` on unexpected database errors | 500 |

A book has these required string properties: `id`, `author`, `title`, `publicationDate`. `publicationDate` is `YYYY-MM-DD`. `id` refers to the public application ID (e.g. `b1`), not MongoDB `_id`. Response projection excludes MongoDB's `_id`.

### Examples

```http
GET /books/b1
```

```json
{"id":"b1","author":"Jane Austen","title":"Pride and Prejudice","publicationDate":"1813-01-28"}
```

```http
GET /books/does-not-exist
```

```json
{"message":"Book not found"}
```

## Setup

1. Install Node.js 22+ and run `npm ci`.
2. Copy `.env.example` to `.env`. Fill in `MONGODB_URI` using your *new* database credentials. Never commit `.env`.
3. In MongoDB Atlas, configure Database Access and allow your current IP in Network Access (follow your security policy).
4. Run `npm run seed` to upsert the three sample books into `cse341-books-db.books` (requires Atlas connectivity and write permissions).
5. Run `npm run dev` locally; test `http://localhost:3000/books` and `http://localhost:3000/books/b1`.
6. Run `npm test` and `npm run lint` before committing.

### Deploying to Render

- Create a Render **Web Service** connected to this GitHub repository.
- Build command: `npm ci`.
- Start command: `npm start`.
- Set the Render environment variables `MONGODB_URI` and `MONGODB_DB_NAME=cse341-books-db` (and optionally `PORT`; Render normally supplies it).
- Do **not** upload `.env` to Render or set `MONGODB_DNS_SERVERS` unless DNS resolution requires it.
- Confirm your Render instance can reach Atlas under Network Access rules.
- After deployment, visit `https://YOUR-SERVICE.onrender.com/books` and `https://YOUR-SERVICE.onrender.com/books/b1` and document the observed status codes.

### Windows DNS troubleshooting

If `querySrv ECONNREFUSED` occurs in Node.js, first test:

```powershell
nslookup -type=SRV _mongodb._tcp.YOUR-CLUSTER.mongodb.net
```

If Windows resolves the SRV record but Node.js does not, optionally add `MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1` to your *local* `.env`, then restart Node. Public DNS servers may be unavailable on restricted networks. If it still fails, try a supported Node LTS version or an Atlas-provided non-SRV connection string.

## Architecture

- `server.js`: connects to MongoDB, then starts listening.
- `src/db/connect.js`: manages MongoDB connection and database selection.
- `src/models/books.js`: implements MongoDB queries.
- `src/controllers/books.js`: shapes HTTP responses and errors.
- `src/routes/books.js`: defines Express book routes.
- `app.js`: registers the router on `/books`.
- `scripts/seed-books.js`: populates three initial records safely (repeatable upsert).
- `tests/books.test.js`: isolated endpoint tests with a fake DB (no Atlas credentials required).

## GitHub workflow for W01

1. Issue #1: database connection and data (feature PR #1).
2. Issue #2: list all books (feature PR #2).
3. Issue #3: look up book by ID (feature PR #3).
4. Issue #4: Render deployment and live endpoint testing. Close it only after actually verifying the live service.

Record what was really tested, and prepare your own reflection and course-required video.
