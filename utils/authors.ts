import { expect, type APIRequestContext } from '@playwright/test';
import { Author, newAuthor, updatedAuthor } from '../utils/testData';

export const authorsEndpoint = '/api/v1/Authors';

export class AuthorsApi {
    constructor(private request: APIRequestContext) {
    }

    /**
     * Get all Authors
     */
    async getAllAuthors() {
        const response = await this.request.get(authorsEndpoint);
        expect.soft(response.status()).toBe(200);
        //Validate there is at least 1 author
        const responseJson = await response.json();
        const authorsCount = await responseJson.length;
        expect(authorsCount).toBeGreaterThan(0);

        return response;
    }

    /**
     * Get the number of Authors
     */
    async getAuthorsCount() {
        const response = await this.request.get(authorsEndpoint);
        expect.soft(response.status()).toBe(200);
        const authorsJson = await response.json();
        const authorsCount = authorsJson.length;
        return authorsCount;
    }

    /**
     * Get a Author by ID
     * @param id - the id of the Author to validate
     */
    async getAuthorByID(id: number) {
        const res = await this.request.get(`${authorsEndpoint}/${id}`);
        return res;
    }

    /**
     * Get a specific item from a Author object
     * @param id - the id of the Author to validate
     */
    async getAuthorFieldData(id: number, key: string) {
        const response = await this.request.get(`${authorsEndpoint}/${id}`);
        const authorJson = await response.json();
        const fieldData = authorJson[key];
        return fieldData; // return the requested field data
    }

    /**
     * Validate the structure of an Author object
     * @param id - the id of the Author to validate
     */
    async validateAuthorStructure(id: number) {
        const response = await this.request.get(`${authorsEndpoint}/${id}`);
        const Author = await response.json();

        expect.soft(Author).toHaveProperty('id');
        expect.soft(typeof Author.id).toBe('number');
    
        expect.soft(Author).toHaveProperty('idBook');
        expect.soft(typeof Author.idBook).toBe('number');
    
        expect.soft(Author).toHaveProperty('firstName');
        expect.soft(typeof Author.firstName).toBe('string');
    
        expect.soft(Author).toHaveProperty('lastName');
        expect.soft(typeof Author.lastName).toBe('string');
    }
    /**
     * Validate that GET /api/v1/Authors returns an array of valid Author objects
     */
    async validateAuthorsArray() {
        const response = await this.request.get(authorsEndpoint);
        const Authors = await response.json();
        expect(Array.isArray(Authors)).toBeTruthy();
        for (const Author of Authors) {
            // Validate each Author's structure directly
            expect.soft(Author).toHaveProperty('id');
            expect.soft(typeof Author.id).toBe('number');
    
            expect.soft(Author).toHaveProperty('idBook');
            expect.soft(typeof Author.idBook).toBe('number');
    
            expect.soft(Author).toHaveProperty('firstName');
            expect.soft(typeof Author.firstName).toBe('string');
    
            expect.soft(Author).toHaveProperty('lastName');
            expect.soft(typeof Author.lastName).toBe('string');
        }
    }

    /**
     * Add a new Author. The number of authors changes, so the id is dynamic, always to be a new one.
     */
    async addAuthor(data: Author, idOffset: number) {
        const response = await this.request.get(authorsEndpoint);
        expect.soft(response.status()).toBe(200);
        const authorsJson = await response.json();
        const authorId = authorsJson.length + idOffset;

        // Build new Author object
        const createAuthor: Author = {
            ...data,
            id: authorId
        };
        // Send a POST request

        const Author = await this.request.post(authorsEndpoint, {
            data: createAuthor
        });
        expect.soft(Author.status()).toBe(200);

        return Author;
    }

    /**
     * Add a new Author with invalid data for negative tests.
     */
    async addAuthorPartial(data: Partial<Author>) {
        const response = await this.request.post(authorsEndpoint, {data});
        return response;
    }

    /**
     * Update the new Author
     */
    async updateAuthor(authorId: number) {
        // Send a PUT request
        const response = await this.request.put(`${authorsEndpoint}/${authorId}`, { data: updatedAuthor });
        expect(response.status()).toBe(200);
        // Parse response body
        const responseBody = await response.json();
        // Validate returned data
        expect(responseBody.idBook).toBe(updatedAuthor.idBook);
        expect(responseBody.firstName).toBe(updatedAuthor.firstName);
        expect(responseBody.lastName).toBe(updatedAuthor.lastName);

        return response
    }

    /**
     * Update the new Author with invalid data for negative tests.
     */
    async updateAuthorPartial(authorId: number, data: Partial<Author>) {
        // Send a PUT request
        const response = await this.request.put(`${authorsEndpoint}/${authorId}`, { data: data });
        return response
    }

    /**
     * Delete the new Author
     */
    async deleteAuthor(authorId: number) {
        // Send a Delete request
        const response = await this.request.delete(`${authorsEndpoint}/${authorId}`);
        expect(response.status()).toBe(200);
        // Validate the author is deleted
        const responseAfterDeletion = await this.request.get(`${authorsEndpoint}/${authorId}`);
        expect(responseAfterDeletion.status()).toBe(404); //As it is a Demo API an author with the checked id may exist after a next request
        
        return response
    }
}