import { test, expect } from '@playwright/test';
import { AuthorsApi } from '../utils/authors';
import { invalidBookIdAuthor, invalidIdAuthor, missingRequiredFieldsAuthor, newAuthor, nullableFieldsAuthor } from '../utils/testData';

test.describe('Authors API tests - Add, Edit and Delete an author', () => {
    let authorsApi: AuthorsApi;
  
    test.beforeEach(async ({ request }) => {
        authorsApi = new AuthorsApi(request);
    });

    test('Create, Edit and Delete an Author', async () => {
        
        //Add an Author with an id which is not existent, no matter the number of authors
        const response = await authorsApi.addAuthor(newAuthor, 300); //id is the number of authors + 300
        expect(response.status()).toBe(200);
        const authorjson = await response.json();
        // Validate response matches request
        expect(authorjson.idBook).toBe(newAuthor.idBook);
        expect(authorjson.firstName).toBe(newAuthor.firstName);
        expect(authorjson.lastName).toBe(newAuthor.lastName);

        //Update the new author
        await authorsApi.updateAuthor(authorjson.id);

        //Delete the new author
        await authorsApi.deleteAuthor(authorjson.id);
    });
});

test.describe('Authors API Tests - Add, Edit and Delete an author - Edge Cases', () => {
    let authorsApi: AuthorsApi;
  
    test.beforeEach(async ({ request }) => {
        authorsApi = new AuthorsApi(request);
    });

    // POST requests - edge cases
    test('New author with nullable fields', async () => {
        const response = await authorsApi.addAuthor(nullableFieldsAuthor, 400); //id is the number of authors + 400
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        // Validate nulls
        expect(responseBody.firstName).toBeNull();
        expect(responseBody.lastName).toBeNull();
        //Clean up
        const id = responseBody.id;
        await authorsApi.deleteAuthor(id);
    });

    test('Error handling: Add an author with missing required fields', async () => {
        const response = await authorsApi.addAuthorPartial(missingRequiredFieldsAuthor);
        expect(response.status()).toBe(400); //As it is demo API the status of the response is 200
    });

    test('Error handling: Add an author with invalid id', async () => {
        const response = await authorsApi.addAuthorPartial(invalidIdAuthor);
        expect(response.status()).toBe(400);
    });

    test('Error handling: Add an author with invalid idBook', async () => {
        const response = await authorsApi.addAuthorPartial(invalidBookIdAuthor);
        expect(response.status()).toBe(400);
    });

    // PUT requests - edge cases

    test('Error handling: Update author with non-existent ID', async () => {
        const response = await authorsApi.updateAuthor(9999);
        expect(response.status()).toBe(404); //As it is demo API the status of the response is 200
    });

    test('Error handling: Update author with invalid idBook', async () => {
        const response = await authorsApi.updateAuthorPartial(100, invalidBookIdAuthor);
        expect(response.status()).toBe(400); 
    });

    test('Update an author with nullable fileds', async () => {
        //Get an existing author with id 5
        const responseGet = await authorsApi.getAuthorByID(5);
        const authorjson = await responseGet.json();
        const idBookBeforeUpdate = authorjson.idBook;
        const firstNameBeforeUpdate = authorjson.firstName;
        const lastNameBeforeUpdate = authorjson.lastName;
        //Update the author with nullable fields
        const newAuthorNullableFields = {
            id: 5,
            idBook: idBookBeforeUpdate
        }

        const response = await authorsApi.updateAuthorPartial(5, newAuthorNullableFields);
        expect(response.status()).toBe(200);
        // Validate nulls
        const responseBody = await response.json();
        expect(responseBody.idBook).toBe(idBookBeforeUpdate);
        expect(responseBody.firstName).toBeNull();
        expect(responseBody.lastName).toBeNull();

        //Clean up - restore the author data
        const authorToRestore = {
            id: 5,
            idBook: idBookBeforeUpdate,
            firstName: firstNameBeforeUpdate,
            lastName: lastNameBeforeUpdate
        }
        const restoredAuthor = await authorsApi.updateAuthorPartial(5, authorToRestore);
        expect(restoredAuthor.status()).toBe(200);
    });

    // DELETE requests - edge cases
    test('Error handling: Delete author with non-existent ID', async () => {
        const response = await authorsApi.deleteAuthor(9999);
        expect(response.status()).toBe(404); //As it is demo API the status of the response is 200
    });
});