# Football Players API

A REST API for managing football players, built with Node.js and Express.

The API supports CRUD operations, filtering, pagination, input validation, sanitization and JSON-based data persistence.

## Technologies

- Node.js
- Express
- Vitest
- Supertest
- Express Validator
- Swagger / OpenAPI
- JSON data storage

## Installation

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Enter the project:

```bash
cd football-players-api
```

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The server runs at:

`http://localhost:3000`

## API Documentation

Swagger documentation is available at:

`http://localhost:3000/api-docs`

Swagger can also be used to test the API endpoints.

## Endpoints

### Get all players

```http
GET /api/players
```

### Get one player

```http
GET /api/players/1
```

### Create player

```http
POST /api/players
```

Example body:

```json
{
  "name": "Kevin White",
  "age": 21,
  "position": "Forward",
  "team": "Farsta",
  "goals": 1
}
```

### Update player

```http
PUT /api/players/1
```

Example body:

```json
{
  "name": "Alex Johnson",
  "age": 25,
  "position": "Defender",
  "team": "Farsta",
  "goals": 4
}
```

### Delete player

```http
DELETE /api/players/1
```

## Filtering

Players can be filtered by position:

```http
GET /api/players?position=Defender
```

or team:

```http
GET /api/players?team=Farsta
```

Filters can also be combined with pagination.

## Pagination

Use `page` and `limit`:

```http
GET /api/players?page=1&limit=2
```

Example:

```http
GET /api/players?position=Defender&page=1&limit=5
```

The default limit is 10 and the maximum limit is 100.

## Validation and sanitization

Input sent when creating players is validated using Express Validator.

The API validates:

- Name
- Age
- Position
- Team
- Goals

String input is trimmed and escaped to reduce the risk of malicious input.

Invalid input returns HTTP status `400`.

## Data storage

Player data is stored in:

```text
data/players.json
```

Changes made through POST, PUT and DELETE are written to the JSON file.

## Testing

Tests are written using Vitest and Supertest.

Run:

```bash
npm test
```

The tests cover:

- GET all players
- GET player by ID
- POST player
- PUT player
- DELETE player
- Filtering
- Pagination
- Input validation

## TDD

The project was primarily developed using Test-Driven Development and the Red-Green-Refactor approach.

Tests were created before implementation and the Git commit history demonstrates the development process.

## Error handling

The API uses HTTP status codes including:

- `200` Successful request
- `201` Resource created
- `400` Invalid input
- `404` Player not found
- `500` Data storage/server error
