const timestamp = new Date().toISOString(); //Today, the day of the test run
export const newBookId = Math.floor(Math.random() * (1000 - 201 + 1)) + 201; // Between 200 and 1000


// ---------- BOOKS Test data ----------
export interface Book {
    id: number;
    title?: string | null;
    description?: string | null;
    pageCount: number;
    excerpt?: string | null;
    publishDate: string; // ISO 8601 date-time string (OpenAPI: string($date-time))
}

//New book
export const newBook: Book = {
    id: newBookId,
    title: `Test Book ${timestamp}`,
    description: `This is a test book created for automation testing purposes - ${timestamp}`,
    pageCount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100, // Between 100 and 5000
    excerpt: `This is an excerpt from test book ${timestamp}`,
    publishDate: new Date().toISOString(),
};

//Updated book
export const updatedBook: Book = {
    id: newBookId,
    title: `Updated Test Book ${timestamp}`,
    description: `Updated This is a test book created for automation testing purposes - ${timestamp}`,
    pageCount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100, // Between 100 and 5000
    excerpt: `Updated This is an excerpt from test book ${timestamp}`,
    publishDate: new Date().toISOString(),
};

//A book without title, description and excerpt
export const nullableFieldsBook: Book = {
    id: Math.floor(Math.random() * (1000 - 201 + 1)) + 201,
    pageCount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100, // Between 100 and 5000
    publishDate: new Date().toISOString(),
};

//A book with invalid id
export const invalidIdBook: Book = {
    id: "abc",
    title: `Test Book with invalid id`,
    description: `Description of Test Book with invalid id`,
    pageCount: 1000,
    publishDate: new Date().toISOString(),
};

//A book with invalid page count
export const invalidPageCountBook: Book = {
    id: 333,
    title: `Test Book with invalid id`,
    description: `Description of Test Book with invalid id`,
    pageCount: null,
    publishDate: new Date().toISOString(),
};

//A book with invalid publish date
export const invalidDateBook: Book = {
    id: 444,
    title: `Test Book with invalid id`,
    description: `Description of Test Book with invalid id`,
    pageCount: 500,
    publishDate: "September 9, 2025",
};

//A book with missing required fields - id, pageCount and publishDate (not applicable for the demo API)
export const missingRequiredFieldsBook: Partial<Book> = {
    title: `Test Book with invalid id`,
    description: `Description of Test Book with invalid id`
};

// ---------- AUTHORS Test data ----------

export interface Author {
    id: number;
    idBook: number;
    firstName?: string | null;
    lastName?: string | null;
}

//New author
export const newAuthor: Author = {
    id: 100,
    idBook: 456,
    firstName: "Test FirstName",
    lastName: "Test LastName"
}

//Updated author
export const updatedAuthor: Partial<Author> = {
    idBook: 666,
    firstName: "Updated FirstName",
    lastName: "Updated LastName"
}

//An author without firstName and lastName
export const nullableFieldsAuthor: Author = {
    id: 777,
    idBook: 456,
}

//Author with invalid id
export const invalidIdAuthor: Partial<Author> = {
    id: 9.45,
    idBook: 456,
    firstName: "Test FirstName",
    lastName: "Test LastName"
}

//Author with invalid idBook
export const invalidBookIdAuthor: Partial<Author> = {
    id: 888,
    idBook: 55.25,
    firstName: "Test FirstName",
    lastName: "Test LastName"
}

//Author with missing required fields - id and idBook
export const missingRequiredFieldsAuthor: Partial<Author> = {
    firstName: "Test FirstName",
    lastName: "Test LastName"
}