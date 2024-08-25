# Tiny Home Booking API Documentation

The Tiny Home Booking Platform API provides access to manage users, properties, bookings, and reviews. The API is built using RESTful principles and requires authentication for most operations.

**Authentication**
This API uses JSON Web Tokens (JWT) for authentication. To access protected routes, include the token in the ‘Authorization’ header as follows:

## User Endpoints

All endpoints related to users.

## Usesr Base URL

 /users

## Authentication

**JWT Token**
  All routes except for POST /users and POST /login require a JWT token for authentication.  
**Protect Middleware**
  Ensures the user is authenticated using JWT token  
**AuthoriseUser(‘admin’) Middleware**  
  Ensures the user has the appropriate role (admin) to access specific routes.

## Error Handling

**400 Bad Request**  
  Returned when there are validation errors or missing required fields.  
**401 Unauthorised**  
  Returned when a user tries to access a protected route without a valid JWT token.  
**403 Forbidden**  
  Returned when a user does not have the appropriate permissions to access a route**.**  
**404 Not Found**
  Returned when a resource (user) is not found.  
**500 Internal Server Error**
  Returned when there is a server-side error.

### User Routes Overview

1. **GET /users** - Retrieve all users  
2. **GET /users/:id**  - Retrieve a single user by ID  
3. **POST /users** - Create a new user
4. **PUT /users/:id**  - Update a user by ID
5. **DELETE /user**  - Delete a user

## 1. Get all Users

**Endpoint**
  GET /users  

**Description**  
  Retrieves a list of all users. Only accessible by admins.  
**Headers**  
  Authorization: Bearer \<JWT token\>  

**Response**  
  **200 OK**
  Returns an array of users.  
  **500 Internal Server Error**  
  If there was an issue retrieving users.  

**Sample Response**
  \[  
    {  
      "\_id": "60c72b1f9b1d8c4a5e6d7f5a",  
      "email": "<user@example.com>",  
      "username": "user1",  
      "firstName": "John",  
      "lastName": "Doe",  
      "phone": "123456789",  
      "dob": "1990-01-01T00:00:00.000Z",  
      "isAdmin": false  
    }  
  \]

## 2. Get User by ID

**Endpoint**
  GET /users/ :id  
**Description**  
  Retrieves a single user by their ID. Accessible by authenticated users  
**Headers**  
  Authorization: Bearer \<JWT token\>  

**Response**  
  **200 OK**
  Returns an array of users.  
  **404 Not Found**
  If the user with the specified ID does not exist
  **500 Internal Server Error**  
  If there was an issue retrieving users.  

**Sample Response**  
  {  
    "\_id": "60c72b1f9b1d8c4a5e6d7f5a",  
    "email": "<user@example.com>",  
    "username": "user1",  
    "firstName": "John",  
    "lastName": "Doe",  
    "phone": "123456789",  
    "dob": "1990-01-01T00:00:00.000Z",  
    "isAdmin": false  
  }  

## 3. Create a User

**Endpoint**
  POST /users  
**Description**  
  Creates a new user  
**Request Body**  
  email (String) \- Required. Must be a valid email address.  
  username (String) \- Required. Must be at least 3 characters long.  
  password (String) \- Required. Must be at least 6 characters long.  
  firstName (String) \- Optional.  
  lastName (String) \- Optional.  
  phone (String) \- Optional.  
  dob (Date) \- Optional. Must be a valid date.  
  isAdmin (Boolean) \- Optional. Defaults to false.  

**Response**  
  **201 Created**
  User created successfully  
  **400 Bad Request**
  Validation errors or email already registered
  **500 Internal Server Error**  
  If there was an issue retrieving users.  

**Sample Response**  
  {  
    "message": "User created successfully",  
    "user": {  
      "\_id": "60c72b1f9b1d8c4a5e6d7f5a",  
      "email": "<user@example.com>",  
      "username": "user1",  
      "firstName": "John",  
      "lastName": "Doe",  
      "phone": "123456789",  
      "dob": "1990-01-01T00:00:00.000Z",  
      "isAdmin": false  
    }  
  }  

## 4. Update a user by ID

**Endpoint**
  PUT /users/ :id  
**Description**  
  Updates a user by their ID  
**Headers**  
  Authorization: Bearer \<JWT token\>  
**Parameters**  
  Id (string) \- The ID of the user to be updated  
**Request Body**  
  email (String) \- Required. Must be a valid email address.  
  username (String) \- Required. Must be at least 3 characters long.  
  password (String) \- Required. Must be at least 6 characters long.  
  firstName (String) \- Optional.  
  lastName (String) \- Optional.  
  phone (String) \- Optional.  
  dob (Date) \- Optional. Must be a valid date.  
  isAdmin (Boolean) \- Optional. Defaults to false.  

**Response**  
  **200 OK**
  User updated successfully  
  **400 Bad Request**
  Validation errors or email registered
  **404 Not Found**
  If the user with the specified ID does not exist
  **500 Internal Server Error**  
  If there was an issue retrieving users.

**Sample Response**  
  {  
    "message": "User updated successfully",  
    "user": {  
      "\_id": "60c72b1f9b1d8c4a5e6d7f5a",  
      "email": "<user@example.com>",  
      "username": "user1",  
      "firstName": "John",  
      "lastName": "Doe",  
      "phone": "123456789",  
      "dob": "1990-01-01T00:00:00.000Z",  
      "isAdmin": false  
    }  
  }

## 5. Delete a User

**Endpoint**
  DELETE  /users/ :id  
**Description**  
  Deletes a user by their ID  
**Headers**  
  Authorization: Bearer \<JWT token\>  
**Parameters**  
  Id (string) - The ID of the user to be deleted  

**Response**  
  **204 No Content**
  User deleted successfully  
  **404 Not Found**
  If the user with the specified ID does not exist
  **500 Internal Server Error**  
  If there was an issue retrieving users.

## 6. Login User

**Endpoint**
  POST /login  
**Description**  
  Authenticates a user and returns a JWT token.  
**Request Body**  
   email (String) - Required. Must be a valid email address.  
   password (String) - Required. Must be at least 6 characters long.  

**Response**  
  **200 OK**
  User updated successfully  
  **400 Bad Request**
  Validation errors or email registered
  **404 Not Found**
  If the user with the specified ID does not exist
  **500 Internal Server Error**  
  If there was an issue retrieving users.  

**Sample Response**  
  {  
    "message": "Login successful",  
    "token": "jwt\_token\_here"  
  }  
  
## Property Endpoints 

All endpoints related to properties

## Property Base URL

- /properties

## Authentication

**JWT Token**
  Required for create, update and delete operations.  
**Protect Middleware**
  Ensures the user is authenticated using JWT token  
**AuthoriseUser(‘admin’) Middleware**  
  Ensures the user has the appropriate role (admin) to access specific routes.

### Routes Overview

1. **GET /properties** - Retrieve all properties  
2. **GET /properties/:id**  - Retrieve a single property by ID  
3. **POST /properties** - Create a new property (Admin only)  
4. **PUT /properties/:id**  - Update a property by ID(Adminonly)  
5. **DELETE /properties/:id**  - Delete a property by ID (Admin only)

## 1. Get Properties

**Endpoint**
  GET /properties  

**Description**  
  Retrieves all properties from the database  

**Response**  
  **200 OK**
  Successfully retrieves all properties
  **500 Internal Server Error**  
  If there was an issue retrieving users.

**Sample Response**  
  \[  
    {  
      "\_id": "64eaebf8d1a7b3e56c7ec2e5",  
      "name": "Seaside Cottage",  
      "location": "Coastal Road, Seaview",  
      "price": 250,  
      "description": "A cosy seaside cottage with stunning ocean views.",  
      ...  
    },  
    ...  
  \]

## 2. Get Property by ID

**Endpoint**
  GET properties/ :id  

**Description**  
  Retrieves a single property by the ID from the database  

**Parameters**  
  Id (string) \- The ID of the property to be retrieved  

**Response**  
  **200 OK**
  Successfully retrieved the property by the ID
  **404 Not Found**
   If the property with the specified ID does not exist
   **500 Internal Server Error**  
  If there was an issue retrieving users.

**Sample Response**  
  {  
    "\_id": "64eaebf8d1a7b3e56c7ec2e5",  
    "name": "Seaside Cottage",  
    "location": "Coastal Road, Seaview",  
    "price": 250,  
    "description": "A cosy seaside cottage with stunning ocean views.",  
    ...  
  }
## 3.Create a Property

