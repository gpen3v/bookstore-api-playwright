import { test, expect } from '@playwright/test';
import { AuthorsApi, authorsEndpoint } from '../utils/authors';
import { newAuthor } from '../utils/testData';

test.describe('Authors API Tests', () => {
    let authorsApi: AuthorsApi;
  
    test.beforeEach(async ({ request }) => {
        authorsApi = new AuthorsApi(request);
    });
  
    test.describe('GET /api/v1/Authors - Get All Authors', () => {

        test('should successfully retrieve all Authors', async () => {
            //Get all authors
            const response = await authorsApi.getAllAuthors();
            expect(response.status()).toBe(200);

            //Validate that GET /api/v1/Authors returns an array of valid Author objects
            await authorsApi.validateAuthorsArray();
        });

        test('should handle performance requirements', async () => {
            //Measure the time for response
            const start = Date.now();
            const response = await authorsApi.getAllAuthors();
            await expect(response).toBeOK();
            const duration = Date.now() - start;
            console.log(`Authors API response time: ${duration} ms`);

            expect(duration).toBeLessThan(5000); // e.g. must respond under 5s
        });
    });


    test.describe('GET /api/v1/Authors/{id} - Get Author by ID', () => {
        test('should successfully retrieve author by valid ID', async () => {
            //Get the first author
            const response = await authorsApi.getAuthorByID(1);
            expect(response.status()).toBe(200);
            //Validate specific fields
            const idBook = await authorsApi.getAuthorFieldData(1, "idBook");
            const firstName = await authorsApi.getAuthorFieldData(1, "firstName");
            const lastName = await authorsApi.getAuthorFieldData(1, "lastName");
            expect((firstName)).toBe("First Name 1");
            expect((lastName)).toBe("Last Name 1");
            expect((idBook)).toBe(1);
        });

        test('should retrieve author by valid ID with correct structure', async () => {
            //Validate the structure of an Author object
            await authorsApi.validateAuthorStructure(1);
        });
  
        test('should handle non-existent author ID', async () => {
            //Get a non-existent author
            const response = await authorsApi.getAuthorByID(9999);
            expect(response.status()).toBe(404);
        });
  
        test('should handle invalid author ID formats', async () => {
            // Test with invalid ID
            const response = await authorsApi.getAuthorByID("asd");
            expect(response.status()).toBe(400);
        });
    });
});