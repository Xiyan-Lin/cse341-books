# W02 Assignment — Books and Authors (provisional plan)

**Warning: exact W02 specification and rubric not retrieved.** The proposed endpoints and fields here are NOT asserted teacher requirements.

## Verified existing GitHub project
- W01 repo: https://github.com/Xiyan-Lin/cse341-books
- Previously merged PRs: #5 MongoDB connection, #6 list books, #7 book by ID
- Existing database: `cse341-books-db`, collection `books`
- GET `/books` -> 200 list, or safe 500
- GET `/books/:id` -> 200 match, 404 missing, or safe 500
- W01 model/controller/router/testing layers already present

## Implementation steps to confirm against course rubric
1. Read teacher's exact Book and Author requirements. Are new documents required in an `authors` collection? Which exact fields?
2. Check whether author references need to be validated or embedded.
3. Confirm which GET, POST, PUT, DELETE routes are required. Do not assume route names or methods.
4. Implement the required controllers/models/routes and validate required fields and referenced IDs. Return accurate 200/201/204/400/404/500 responses and safe error bodies.
5. Update OpenAPI documentation including `requestBody` for write routes. Make docs executable in Swagger UI at teacher's required URL.
6. Add tests for success, missing fields, missing related IDs, nonexistent resources, and exceptions; run `npm test`, `npm run lint`.
7. Verify Atlas data, create appropriately scoped GitHub branches/PRs if required, then deploy and test Render.

## Submission checklist — cannot finalize without Canvas rubric
- GitHub repo or PR links (as specified)
- Actual deployed Render and Swagger UI links (as specified)
- Required video or reflection (only if teacher requests)
- Any Team Activity evidence/answers (only if required)

Do not commit `.env` or expose Atlas passwords. Do not claim the above steps were run or a deployment was verified until that actually happens.