import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL as string | undefined;
const apiConfig = { baseURL: serverUrl };

// Create axios instance
export const $axios = axios.create(apiConfig);

// log the url if in development mode
console.log(`API_URL:`, serverUrl);

export interface Book {
  id: string;
  title: string;
  description: string;
  available?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookForm = Pick<Book, "title" | "description" | "available">;

class BookService {
  static getAll() {
    return $axios.get<Book[]>("/books");
  }

  static fetchBooks() {
    return useFetch<Book[]>("/books", apiConfig);
  }

  static get(id: string) {
    return $axios.get<Book>(`/books/${id}`);
  }

  static fetchBook(id: ComputedRef<string>) {
    return useFetch<Book>(`/books/${id.value}`, apiConfig);
  }

  static create(data: BookForm) {
    return $axios.post<Book>("/books", data);
  }

  static update(id: string, data: BookForm) {
    return $axios.put<any>(`/books/${id}`, data);
  }

  static delete(id: any) {
    return $axios.delete<any>(`/books/${id}`);
  }

  static deleteAll() {
    return $axios.delete<any>(`/books`);
  }

  static findByTitle(title: string) {
    return $axios.get<Book[]>(`/books?title=${title}`);
  }

  static validate(data: BookForm) {
    const errors: string[] = [];
    if (!data.title) {
      errors.push("Title is required.");
    }
    if (!data.description) {
      errors.push("Description is required.");
    }
    return errors;
  }
}

export default BookService;
