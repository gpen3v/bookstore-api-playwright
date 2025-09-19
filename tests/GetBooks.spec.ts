import { test, expect } from '@playwright/test';
import { BookstoreApi } from '../utils/books.ts';

test.describe('Books API Tests', () => {
    let booksApi: BookstoreApi;
  
    test.beforeEach(async ({ request }) => {
        booksApi = new BookstoreApi(request);
    });
  
    test.describe('GET /api/v1/Books - Get All Books', () => {

        test('should successfully retrieve all books', async () => {
            //Get all books
            const response = await booksApi.getAllBooks();
            expect(response.status()).toBe(200);

            //Validate that GET /api/v1/Books returns an array of valid book objects
            await booksApi.validateBooksArray();

        });
  
        test('should handle performance requirements', async () => {
            //Measure the time for response
            const start = Date.now();
            const response = await booksApi.getAllBooks();
            await expect(response).toBeOK();
            const duration = Date.now() - start;

            expect(duration).toBeLessThan(5000); // e.g. must respond under 5s
        });
    });
  
    test.describe('GET /api/v1/Books/{id} - Get Book by ID', () => {

        test('should successfully retrieve book by valid ID', async () => {
            //Get the first book and validate it is retrieved
            const response = await booksApi.getBookByID(1);
            expect(response.status()).toBe(200);
            const title = await booksApi.getBookFieldData(1, "title");
            expect((title)).toBe("Book 1");
        });

        test('should retrieve book by valid ID with correct structure', async () => {
            //Validate the structure of a book object
            await booksApi.validateBookStructure(1);
        });
  
        test('should handle non-existent book ID', async () => {
            //Get a book by non-existent id
            const response = await booksApi.getBookByID(9999);
            expect(response.status()).toBe(404);
        });
  
        test('should handle invalid book ID formats', async () => {
            // Test with invalid ID
            const response = await booksApi.getBookByID("asd");
            expect(response.status()).toBe(400);
        });
        
        //Test with boundary values for a book id - 0,1, last book id, last book id + 1
        test('should handle boundary values for book ID', async () => {
            const lastBookId = await booksApi.getBooksCount() 
            const maxBoundaryId = lastBookId + 1;

            let response = await booksApi.getBookByID(0);
            expect.soft(response.status()).toBe(404);

            response = await booksApi.getBookByID(1);
            expect.soft(response.status()).toBe(200);

            response = await booksApi.getBookByID(lastBookId);
            expect.soft(response.status()).toBe(200);

            response = await booksApi.getBookByID(maxBoundaryId);
            expect.soft(response.status()).toBe(404);
        });
    });
});
