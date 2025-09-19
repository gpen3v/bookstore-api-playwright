# Bookstore API Automation

This project contains automated API tests for the Bookstore API (https://fakerestapi.azurewebsites.net/), covering CRUD operations for Authors and Books endpoints using Playwright.

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd BookstoreAPIAutomation
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run tests:**
   ```sh
   npx playwright test
   ```
4. **View test reports:**
   After running tests, open the HTML report:
   ```sh
   npx playwright show-report
   ```

## Project Structure & File Descriptions

- `playwright.config.ts` - Playwright configuration file. Contains the project with the Base URL of the tested API and other configurations
- `package.json` - Project dependencies and scripts.
- `playwright-report/` - Folder containing Playwright HTML test reports.
- `test-results/` - Folder containing raw test result files.

### Test Files (`tests/`)
- `AuthorAddEditDelete.spec.ts` - Tests for adding, editing, and deleting authors, including negative cases.
- `BooksAddEditDelete.spec.ts` - Tests for adding, editing, and deleting books, including negative cases.
- `GetAuthors.spec.ts` - Tests for retrieving authors (all and by ID), including structure and error handling.
- `GetBooks.spec.ts` - Tests for retrieving books (all and by ID), including structure, boundary, and error handling.

### Utilities (`utils/`)
- `authors.ts` - Helper class for making API requests related to authors.
- `books.ts` - Helper class for making API requests related to books.
- `testData.ts` - Contains reusable test data for authors and books.

### Reporting
Reports are generated using the default Playwright reporter.
The playwright-report folder is commented out in the .gitignore file to ensure a report is available as a deliverable, as requested in the assessment.

### CI/CD in Github Actions
Tests are scheduled to run every day at 07:00 and 17:00 Bulgarian time.
Tests are set to execute sequentially.

### Coverage
Covered Test Cases - 36

Covered API Endpoints:

Books API:
1. GET /api/v1/Books – Retrieve a list of all books.
2. GET /api/v1/Books/{id} – Retrieve details of a specific book by its ID.
3. POST /api/v1/Books – Add a new book to the system.
4. PUT /api/v1/Books/{id} – Update an existing book by its ID.
5. DELETE /api/v1/Books/{id} – Delete a book by its ID.

Authors API:
1. GET /api/v1/Authors – Retrieve a list of all authors.
2. GET /api/v1/Authors/{id} – Retrieve details of a specific author by their ID.
3. POST /api/v1/Authors – Add a new author to the system.
4. PUT /api/v1/Authors/{id} – Update an existing author’s details.
5. DELETE /api/v1/Authors/{id} – Delete an author by their ID.

6 tests fail due to the demo API returning success responses for certain invalid requests.

---

For any questions or issues, please contact the project maintainer.
