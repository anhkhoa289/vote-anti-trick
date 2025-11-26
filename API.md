# API Documentation

This document provides information about the Infrastructure Voting System API.

## OpenAPI Specification

The complete API specification is available in `openapi.yaml` following the OpenAPI 3.0.3 standard.

## Viewing the Documentation

You can view and interact with the API documentation using various tools:

### 1. Swagger UI (Online)
Visit [Swagger Editor](https://editor.swagger.io/) and paste the contents of `openapi.yaml` to view and test the API interactively.

### 2. Swagger UI (Local)
```bash
# Using Docker
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd)/openapi.yaml:/openapi.yaml swaggerapi/swagger-ui

# Then open http://localhost:8080 in your browser
```

### 3. Redoc (Local)
```bash
# Using npx
npx @redocly/cli preview-docs openapi.yaml

# Or using Docker
docker run -p 8080:80 -e SPEC_URL=openapi.yaml -v $(pwd)/openapi.yaml:/usr/share/nginx/html/openapi.yaml redocly/redoc
```

### 4. VS Code Extension
Install the [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) extension and open `openapi.yaml`.

## API Overview

### Base URLs
- **Development**: `http://localhost:3000`
- **Production**: `https://vote-anti-trick.vercel.app`

### Endpoints

#### Infrastructures
- `GET /api/infrastructures` - List all infrastructures with vote counts
- `POST /api/infrastructures` - Create a new infrastructure
- `GET /api/infrastructures/{id}` - Get a specific infrastructure

#### Votes
- `POST /api/infrastructures/{id}/vote` - Vote for an infrastructure

## Quick Start Examples

### List All Infrastructures
```bash
curl http://localhost:3000/api/infrastructures
```

### Create New Infrastructure
```bash
curl -X POST http://localhost:3000/api/infrastructures \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kubernetes",
    "description": "Container orchestration platform",
    "imageUrl": "https://example.com/k8s.png"
  }'
```

### Get Single Infrastructure
```bash
curl http://localhost:3000/api/infrastructures/{id}
```

### Vote for Infrastructure
```bash
curl -X POST http://localhost:3000/api/infrastructures/{id}/vote \
  -H "Content-Type: application/json" \
  -d '{
    "voterName": "John Doe",
    "voterEmail": "john@example.com"
  }'
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request (e.g., missing required fields)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Features

### Vote Tracking
- Votes include optional voter name and email
- IP addresses are automatically captured from request headers
- Cascading deletes: removing an infrastructure deletes all its votes

### Data Model
- **Infrastructure**: Technologies with name, description, and optional image
- **Vote**: Vote records linked to infrastructures with voter information

## Development

For local development:

```bash
# Start the development server
yarn dev

# The API will be available at http://localhost:3000
```

For more information about the project setup and development workflow, see [CLAUDE.md](./CLAUDE.md).
