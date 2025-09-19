import { test, expect } from '@playwright/test';
import { BookstoreApi } from '../utils/books';
import { newBook, newBookId, missingRequiredFieldsBook, invalidDateBook, invalidIdBook, nullableFieldsBook, invalidPageCountBook } from '../utils/testData';

test.describe('Books API Tests - Add, Update and Delete a book', () => {
    let booksApi: BookstoreApi;

    test.beforeEach(async ({ request }) => {
        booksApi = new BookstoreApi(request);
    });

    test('Create a new book', async () => {
        const response = await booksApi.addBook(newBook);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        // Validate response matches request
        expect(responseBody).toEqual(newBook);
    });

    test('Update the new book', async () => {
        await booksApi.updateBook(newBookId);
    });

    test('Delete the book', async () => {
        await booksApi.deleteBook(newBookId);
    });
    
});

test.describe('Books API Tests - Add, Update and Delete a book - Edge cases', () => {
    let booksApi: BookstoreApi;

    test.beforeEach(async ({ request }) => {
        booksApi = new BookstoreApi(request);
    });

    // POST requests - edge cases
    test('Validate nullable fields', async () => {
        const response = await booksApi.addBook(nullableFieldsBook);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        // Validate nulls
        expect(responseBody.title).toBeNull();
        expect(responseBody.description).toBeNull();
        expect(responseBody.excerpt).toBeNull();
        //Clean up
        const id = responseBody.id;
        await booksApi.deleteBook(id);
    });

    test('Validate missing Required fields', async () => {
        const response = await booksApi.addBookPartial(missingRequiredFieldsBook);
        expect(response.status()).toBe(400); //As it is demo API the status of the response is 200
    });

    test('Validate invalid id', async () => {
        const response = await booksApi.addBook(invalidIdBook);
        expect(response.status()).toBe(400);
    });

    test('Validate invalid Page Count', async () => {
        const response = await booksApi.addBook(invalidPageCountBook);
        expect(response.status()).toBe(400);
    });

    test('Validate invalid Publish Date', async () => {
        const response = await booksApi.addBook(invalidDateBook);
        expect(response.status()).toBe(400);
    });
    // PUT requests - edge cases
    test('Error handling: Update book with nullable fileds', async () => {
        //Get an existing book with id 5
        const responseGet = await booksApi.getBookByID(5);  
        const bookjson = await responseGet.json();
        // Prepare data with nullable fields
        const updatedData = {
            title: null,
            description: null,
            excerpt: null
        };
        // Update the book with nullable fields
        const response = await booksApi.updateBookPartial(bookjson.id, updatedData);
        expect(response.status()).toBe(200); //As it is demo API the status of the response is 200
        //Clean up - restore the book data
        await booksApi.updateBook(bookjson.id);
    });

    test('Error handling: Update book with non-existent ID', async () => {
        const response = await booksApi.updateBook(9999);
        expect(response.status()).toBe(404); //As it is demo API the status of the response is 200
    });

    test('Error handling: Update book with invalid id', async () => {
        const response = await booksApi.updateBookPartial(100, invalidIdBook);
        expect(response.status()).toBe(400); 
    });

    test('Error handling: Update book with invalid page count', async () => {
        const response = await booksApi.updateBookPartial(100, invalidPageCountBook);
        expect(response.status()).toBe(400); 
    });

    test('Error handling: Update book with invalid publish date', async () => {
        const response = await booksApi.updateBookPartial(100, invalidDateBook);
        expect(response.status()).toBe(400); 
    });

    // DELETE requests - edge cases
    test('Error handling: Delete book with non-existent ID', async () => {
        const response = await booksApi.deleteBook(9999);
        expect(response.status()).toBe(404); //As it is demo API the status of the response is 200
    });
});