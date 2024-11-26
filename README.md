# kgk-backend(Migration is not needed in dev environment)

The current backend provides functionality for managing resources, including user registration, authentication, resource creation, retrieval, access with expiration, and deletion.

---

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Expiry Logic](#expiry-logic)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)

---

## API Endpoints

### User Authentication
| Endpoint               | Method | Description                   |
|------------------------|--------|-------------------------------|
| `/resources/register`  | POST   | Registers a new user.         |
| `/resources/login`     | POST   | Authenticates a user and returns a JWT token. |

### Resource Management
| Endpoint                  | Method | Description                                              |
|---------------------------|--------|----------------------------------------------------------|
| `/resources`              | POST   | Creates a new resource with an expiration time. Requires authentication. |
| `/resources`              | GET    | Retrieves all resources created by the user. Optional `status` query for filtering. |
| `/resources/:accessToken` | GET    | Grants access to a specific resource via an access token. |
| `/resources/:id`          | DELETE | Deletes a resource by its ID. Requires authentication.   |

---

## Expiry Logic

The expiration logic is implemented as follows:
- Each resource includes an `expirationTime` parameter, which is stored as an ISO 8601 timestamp.
- When accessing a resource via `/resources/:accessToken`, the system checks:
  - If the `expirationTime` has passed, access is denied with a 403 Forbidden response.
  - If the current time is within the valid period, the resource is served to the user.
- Expired resources are not automatically deleted but remain inaccessible until explicitly deleted by the user.

---

## Setup Instructions

Follow these steps to set up and run the API locally:

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/runtyalien/kgk_backend.git
   cd kgk_backend
   
2. Install dependencies:
    ```bash
    npm install
    
3. Configure environment variables: Create a .env file at the root of the project and define the following:
    ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=password
    DB_NAME=resource_sharing
    JWT_SECRET=kgk_diamonds
    JWT_EXPIRATION=1h
    PORT=3000
    
4. Start the server:
    ```bash
    npm start
    
5. The API will be available at http://localhost:3000.


## Usage

### Example Workflow
1. Register: Create a new user using the ``` /resources/register``` POST endpoint.
2. Login: Authenticate and get a JWT token using ```/resources/login``` POST endpoint.
3. Create Resource: Use the ```/resources``` POST endpoint to create a resource with an expiration time.
4. Access All Resource: Access the resource using the ```/resources```GET endpoint.
5. Access Active Resource: Access the resource using the ```/resources?status=active```GET endpoint.
5. Access Expired Resource: Access the resource using the ```/resources?status=expired```GET endpoint.
4. Access Resource: Access the resource using the ```/resources/:accessToken``` GET endpoint to share.
5. Delete Resource: Delete an expired or unwanted resource using ```/resources/:id```.
