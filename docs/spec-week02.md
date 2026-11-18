# W02 API Spec — Version 1 and Version 2

## Version 1 — requirements and initial decisions

- Authors: custom string `id`, required `name`, integer `birthYear`.
- Books: custom string `id`, required `authorId`, `title`, and `publicationDate` (`YYYY-MM-DD`).
- Each book references an author document by `authorId` → `authors.id`.
- Both collections support GET list, GET by ID, POST, PUT, and DELETE.
- API responses use JSON; unexpected database failures return safe HTTP 500.
- Swagger UI must document and test every route locally and on Render.

## Evaluation of Version 1

- **Bugs:** duplicates or missing author references need explicit validation and a unique `id` index.
- **Security:** reject missing/invalid input, never return database credentials or raw errors.
- **Efficiency:** use indexed public IDs; a simple reference is enough and no `$lookup` is needed.
- **Ambiguity:** decide on update body requirements, author deletion rules, and duplicate IDs.

## Version 2 — implementation contract

### Authors

| Route | Success | Errors |
| --- | --- | --- |
| GET `/authors` | 200 array | 500 |
| GET `/authors/:id` | 200 author | 404, 500 |
| POST `/authors` | 201 author | 400 missing/invalid/duplicate, 500 |
| PUT `/authors/:id` | 200 author | 400 invalid, 404 absent, 500 |
| DELETE `/authors/:id` | 204 empty body | 404 absent, 409 if referenced by books, 500 |

- `POST` body: `{ "id": "a4", "name": "Example Author", "birthYear": 1980 }`.
- `PUT` body: `{ "name": "Updated Author", "birthYear": 1981 }`.
- `birthYear` must be an integer from 0 to the current year. Names and IDs must be nonempty strings.
- Do not delete an author still referenced by a book: return **409 Conflict**, avoiding dangling references.
- Duplicate IDs return **400 Bad Request**, consistent with course's acceptable choices.

### Books

| Route | Success | Errors |
| --- | --- | --- |
| GET `/books` | 200 array | 500 |
| GET `/books/:id` | 200 book | 404, 500 |
| POST `/books` | 201 book | 400 missing/invalid/duplicate/invalid authorId, 500 |
| PUT `/books/:id` | 200 book | 400 invalid/missing/nonexistent authorId, 404 missing book, 500 |
| DELETE `/books/:id` | 204 empty body | 404 missing, 500 |

- `POST` body: `{ "id": "b4", "authorId": "a1", "title": "Example Book Title", "publicationDate": "2026-01-15" }`.
- `PUT` body: `{ "authorId": "a2", "title": "Updated Book Title", "publicationDate": "2026-02-20" }`.
- `publicationDate` requires a valid calendar date in `YYYY-MM-DD` format. `authorId` must resolve to an existing author.
- Unique indexes on custom IDs prevent accidental duplicates even under concurrent requests.
- This contract intentionally uses no `author` name field on books; it replaces that field with `authorId`.

### Testing and deployment

- All endpoints documented in OpenAPI 3 including request bodies and status codes.
- Run `npm test`, `npm run lint`, and `npm run swagger` before creating PRs.
- Verify all endpoints from local and deployed `/api-docs`; Render must connect to Atlas using environment variables.
