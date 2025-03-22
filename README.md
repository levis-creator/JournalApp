---

# **Personal Journaling App**

This is a full-stack personal journaling application built with **Next.js** (TypeScript) and **Prisma**. It allows users to securely create, manage, and analyze their journal entries with features like categorization, summaries, and optional AI-powered insights.

---

## **Table of Contents**
1. Features
2. Tech Stack
3. Setup Instructions
4. Environment Variables
5. API Documentation
6. System Design
7. Testing
8. Contributing

---

## **Features**
- **User Authentication**: Secure registration and login using JWT.
- **Journal Management**: Create, read, update, and delete journal entries.
- **Categorization**: Tag entries with custom categories.
- **Summary Analytics**: Visualize entry frequency, category distribution, and word count trends.
- **Optional AI Features**: Sentiment analysis, auto-categorization, and writing prompts.

---

## **Tech Stack**
- **Frontend**: Next.js (TypeScript), TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (managed with Prisma)
- **Authentication**: JWT with HTTP-only cookies
- **State Management**: React Query
- **Testing**: Jest, React Testing Library

---

## **Setup Instructions**

### **Prerequisites**
- Node.js (v18 or higher)
- PostgreSQL (local or cloud-hosted)
- Git

### **Steps**
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/levis-creator/JournalApp.git
   cd personal-journaling-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables (see Environment Variables for details):
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/journal_db"
     JWT_SECRET="your_jwt_secret_key"
     ```

4. **Set Up Database**:
   - Run Prisma migrations to create the database schema:
     ```bash
     npx prisma migrate dev --name init
     ```
   

5. **Run the Application**:
   ```bash
   npm run dev
   ```
   - The app will be available at `http://localhost:3000`.

---

## **Environment Variables**
| **Variable**      | **Description**                                                                 |
|--------------------|---------------------------------------------------------------------------------|
| `DATABASE_URL`     | PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/journal_db`). |
| `JWT_SECRET`       | Secret key for signing JWTs.                                                   |
| `NODE_ENV`         | Environment mode (`development`, `production`).                                |

---

## **API Documentation**

### **Base URL**
```
http://localhost:3000/api
```

### **Authentication**
| **Endpoint**       | **Method** | **Description**                          | **Request Body**                                                                 |
|--------------------|------------|------------------------------------------|----------------------------------------------------------------------------------|
| `/auth/signup`     | POST       | Register a new user                      | `{ email: string, password: string }`                                            |
| `/auth/login`      | POST       | Log in a user                            | `{ email: string, password: string }`                                            |
| `/auth/logout`     | POST       | Log out the user                         | *None*                                                                           |
| `/auth/me`         | GET        | Get current user details                 | *None*                                                                           |

### **Journal Entries**
| **Endpoint**       | **Method** | **Description**                          | **Request Body**                                                                 |
|--------------------|------------|------------------------------------------|----------------------------------------------------------------------------------|
| `/entries`         | GET        | Get all entries for the user             | *None*                                                                           |
| `/entries`         | POST       | Create a new entry                       | `{ title: string, content: string, categories?: string[] }`                      |
| `/entries/:id`     | GET        | Get a single entry by ID                 | *None*                                                                           |
| `/entries/:id`     | PUT        | Update an entry                          | `{ title?: string, content?: string, categories?: string[] }`                    |
| `/entries/:id`     | DELETE     | Delete an entry                          | *None*                                                                           |

### **Categories**
| **Endpoint**       | **Method** | **Description**                          | **Request Body**                                                                 |
|--------------------|------------|------------------------------------------|----------------------------------------------------------------------------------|
| `/categories`      | GET        | Get all categories for the user          | *None*                                                                           |
| `/categories`      | POST       | Create a new category                    | `{ name: string }`                                                               |
| `/categories/:id`  | PUT        | Update a category name                   | `{ name: string }`                                                               |
| `/categories/:id`  | DELETE     | Delete a category                        | *None*                                                                           |

### **Summaries**
| **Endpoint**               | **Method** | **Description**                          | **Query Parameters**                                           |
|----------------------------|------------|------------------------------------------|-----------------------------------------------------------------|
| `/summary/entry-frequency` | GET        | Entry frequency heatmap data             | `startDate: string (ISO), endDate: string (ISO)`               |
| `/summary/category-distribution` | GET | Category distribution (pie chart)        | *None*                                                         |
| `/summary/word-count-trends` | GET       | Word count trends over time              | `interval: "day"|"week"|"month", startDate: string, endDate: string` |
| `/summary/mood-analysis`   | GET        | Mood tracking (if bonus implemented)     | *None*                                                         |

---

## **System Design**
### **Architecture**
- **Frontend**: Next.js with React for server-side rendering and client-side interactivity.
- **Backend**: Next.js API routes for handling requests and Prisma for database interactions.
- **Database**: PostgreSQL for relational data storage.
- **Authentication**: JWT with HTTP-only cookies for secure session management.

### **Data Model**
- **User**: Stores user details (email, password hash).
- **Entry**: Stores journal entries (title, content, date, user ID).
- **Category**: Stores categories (name, user ID) with a many-to-many relationship to entries.

### **Scaling Considerations**
- **Database Indexing**: Indexes on frequently queried fields (e.g., `userId`, `date`).
- **Caching**: Use Redis for caching summary data to reduce database load.
- **Load Balancing**: Distribute traffic across multiple instances using a load balancer.

---

Here’s the updated **Testing** section of the `README.md` file to reflect that you're using **Vitest** for testing:

---

## **Testing**
This project uses **Vitest** for unit and integration testing. Vitest is a fast and modern testing framework that integrates seamlessly with Vite and Next.js.

### **Test Types**
1. **Unit Tests**:
   - Test individual functions, utilities, and components.
   - Located in the `__tests__` or `tests` directory.
   - Example: Testing a utility function that formats dates.

2. **Integration Tests**:
   - Test API endpoints and database interactions.
   - Located in the `__tests__/api` directory.
   - Example: Testing the `/api/entries` endpoint to ensure it creates and retrieves journal entries correctly.

3. **Component Tests**:
   - Test React components in isolation.
   - Located in the `__tests__/components` directory.
   - Example: Testing the `JournalEntryForm` component to ensure it renders and behaves as expected.

### **Running Tests**
1. **Run All Tests**:
   ```bash
   npm test
   ```

2. **Run Specific Test Files**:
   ```bash
   npm test path/to/test/file.test.ts
   ```

3. **Watch Mode**:
   Run tests in watch mode for development:
   ```bash
   npm test -- --watch
   ```

4. **Coverage Report**:
   Generate a test coverage report:
   ```bash
   npm test -- --coverage
   ```

### **Example Test**
Here’s an example of a unit test for a utility function:

```typescript
// tests/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '../../src/utils/formatDate';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    const date = '2023-09-20T12:00:00Z';
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('September 20, 2023');
  });
});
```

### **Test Setup**
- **Test Environment**: Configured in `vite.config.ts` or `vitest.config.ts`.
- **Mocking**: Use Vitest’s built-in mocking capabilities for API calls and external dependencies.
- **Database**: Use a separate test database or mock database interactions for integration tests.


Let me know if you need further details or examples for testing with Vitest!
---

## **Contributing**
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

---
