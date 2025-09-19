import { expect, type APIRequestContext } from '@playwright/test';
import { updatedBook, Book } from './testData';

export const booksEndpoint = '/api/v1/Books';

export class BookstoreApi {
    constructor(private request: APIRequestContext) {
    }

    /**
     * Get all books
     */
    async getAllBooks() {
        const response = await this.request.get(booksEndpoint);
        expect.soft(response.status()).toBe(200);
        //Validate there is at least 1 book
        const booksJson = await response.json();
        const booksCount = booksJson.length;
        expect(booksCount).toBeGreaterThan(0);

        return response;
    }

    /**
     * Get the number of books
     */
    async getBooksCount() {
        const response = await this.request.get(booksEndpoint);
        expect.soft(response.status()).toBe(200);
        const booksJson = await response.json();
        const booksCount = booksJson.length;
        return booksCount;
    }

    /**
     * Get a book by ID
     * @param id - the id of the book to validate
     */
    async getBookByID(id: number) {
        const res = await this.request.get(`${booksEndpoint}/${id}`);
        return res;
    }

    /**
     * Get a specific field data from a book object
     * @param id - the id of the book to validate
     */
    async getBookFieldData(id: number, key: string) {
        const response = await this.request.get(`${booksEndpoint}/${id}`);
        const bookJson = await response.json();
        const fieldData = bookJson[key];
        return fieldData; // return the requested field
    }

    /**
     * Validate the structure of a book object
     * @param id - the id of the book to validate
     */
    async validateBookStructure(id: number) {
        const response = await this.request.get(`${booksEndpoint}/${id}`);
        const book = await response.json();

        expect.soft(book).toHaveProperty('id');
        expect.soft(typeof book.id).toBe('number');
    
        expect.soft(book).toHaveProperty('title');
        expect.soft(typeof book.title).toBe('string');
    
        expect.soft(book).toHaveProperty('description');
        expect.soft(typeof book.description).toBe('string');
    
        expect.soft(book).toHaveProperty('pageCount');
        expect.soft(typeof book.pageCount).toBe('number');
    
        expect.soft(book).toHaveProperty('excerpt');
        expect.soft(typeof book.excerpt).toBe('string');
    
        expect.soft(book).toHaveProperty('publishDate');
        expect.soft(typeof book.publishDate).toBe('string'); // ISO datetime string
    }
    /**
     * Validate that GET /api/v1/Books returns an array of valid book objects
     */
    async validateBooksArray() {
        const res = await this.request.get(booksEndpoint);
        const books = await res.json();
        expect(Array.isArray(books)).toBeTruthy();
        for (const book of books) {
            // Validate each book's structure directly
            expect(book).toHaveProperty('id');
            expect(typeof book.id).toBe('number');

            expect(book).toHaveProperty('title');
            expect(typeof book.title).toBe('string');

            expect(book).toHaveProperty('description');
            expect(typeof book.description).toBe('string');

            expect(book).toHaveProperty('pageCount');
            expect(typeof book.pageCount).toBe('number');

            expect(book).toHaveProperty('excerpt');
            expect(typeof book.excerpt).toBe('string');
            
            expect(book).toHaveProperty('publishDate');
            expect(typeof book.publishDate).toBe('string');
        }
    }

    /**
     * Add a new book
     */
    async addBook(data: Book) {
        // Send a POST request
        const response = await this.request.post(booksEndpoint, {data});
        return response;
    }

    /**
     * Add a new book with invalid data for negative tests
     */
    async addBookPartial(data: Partial<Book>) {
        // Send a POST request
        const response = await this.request.post(booksEndpoint, {data});
        return response;
    }

    /**
     * Update the new book
     */
    async updateBook(bookId: number) {
        // Send a PUT request
        const response = await this.request.put(`${booksEndpoint}/${bookId}`, { data: updatedBook });
        expect(response.status()).toBe(200);
        // Parse response body
        const responseBody = await response.json();
        // Validate returned data
        expect(responseBody).toEqual(updatedBook);
        return response;
    }

    /**
     * Update the new book
     */
    async updateBookPartial(bookId: number, data: Partial<Book>) {
        // Send a PUT request
        const response = await this.request.put(`${booksEndpoint}/${bookId}`, { data: data });
        return response;
    }

    /**
     * Delete the new book
     */
    async deleteBook(bookId: number) {
        // Send a Delete request
        const response = await this.request.delete(`${booksEndpoint}/${bookId}`);
        expect(response.status()).toBe(200);
        // Validate the book is deleted
        const responseAfterDeletion = await this.request.get(`${booksEndpoint}/${bookId}`);
        expect(responseAfterDeletion.status()).toBe(404);
        return response;
    }
}