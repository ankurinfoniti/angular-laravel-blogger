import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  getBlogs() {
    return this.http
      .get<Array<Blog>>(`${env.BASE_URL}/admin-blogs`)
      .pipe(catchError(this.handleError));
  }

  getBlog(id: number) {
    return this.http
      .get<Blog>(`${env.BASE_URL}/admin-blog/${id}`)
      .pipe(catchError(this.handleError));
  }

  createBlog(blog: any) {
    return this.http
      .post<any>(`${env.BASE_URL}/create-blog`, blog)
      .pipe(catchError(this.handleError));
  }

  updateBlog(blog: any, id: number) {
    return this.http
      .post<any>(`${env.BASE_URL}/update-blog/${id}`, blog)
      .pipe(catchError(this.handleError));
  }

  deleteBlog(id: number) {
    return this.http
      .delete<any>(`${env.BASE_URL}/delete-blog/${id}`)
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
    const errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.',
    };
    return throwError(() => errorData);
  }
}
