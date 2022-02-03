import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Blogpost } from '../Models/blogpost';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root',
})
export class BlogpostService {
  errorData: {} | undefined;

  constructor(private http: HttpClient) {}

  getBlogs() {
    return this.http
      .get<Array<Blogpost>>(`${env.BASE_URL}/blogs`)
      .pipe(catchError(this.handleError));
  }

  getFeaturedBlogs() {
    return this.http
      .get<Array<Blogpost>>(`${env.BASE_URL}/featured-blogs`)
      .pipe(catchError(this.handleError));
  }

  getBlog(id: number) {
    return this.http
      .get<Blogpost>(`${env.BASE_URL}/blog/${id}`)
      .pipe(catchError(this.handleError));
  }

  getRecentBlogs() {
    return this.http
      .get<Array<Blogpost>>(`${env.BASE_URL}/recent-blogs`)
      .pipe(catchError(this.handleError));
  }

  getCategories() {
    return this.http
      .get<Array<Category>>(`${env.BASE_URL}/categories`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.',
    };
    return throwError(() => this.errorData);
  }
}
