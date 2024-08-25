# Tiny Home Booking API Documentation

The Tiny Home Booking Platform API provides access to manage users, properties, bookings, and reviews. The API is built using RESTful principles and requires authentication for most operations.

## Authentication

***This API uses JSON Web Tokens (JWT) for authentication. To access protected routes, include the token in the ‘Authorization’ header.***

**Headers:** `Authorization: Bearer <JWT token>`

## User Endpoints

All endpoints related to users.

### Base URL `/users`

### Authentication

- **JWT Token:** All routes except for `POST /users` and `POST /login` require a JWT token for authentication.

### Middleware

- **protect:** Ensures the user is authenticated using JWT token.
- **authoriseUser('admin')**: Ensures the user has the appropriate role (admin) to access specific routes.

### Error Handling

- **400 Bad Request:** Returned when there are validation errors or missing required fields.
- **401 Unauthorized:** Returned when a user tries to access a protected route without a valid JWT token.
- **403 Forbidden:** Returned when a user does not have the appropriate permissions to access a route.
- **404 Not Found:** Returned when a resource (user) is not found.
- **500 Internal Server Error:** Returned when there is a server-side error.

### Get All Users

- **Endpoint:** `GET /users`
- **Description:** Retrieves a list of all users. Only accessible by admins.
- **Headers:** `Authorization: Bearer <JWT token>`
- **Response:**
- **200 OK:** Returns an array of users.
- **500 Internal Server Error:** If there was an issue retrieving users.
- **Sample Response:**

```json
[
  {
    "_id": "60c72b1f9b1d8c4a5e6d7f5a",
    "email": "user@example.com",
    "username": "user1",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "123456789",
    "dob": "1990-01-01T00:00:00.000Z",
    "isAdmin": false
  }
]
```
