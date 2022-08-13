import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http
      .get<Array<Category>>(`${env.BASE_URL}/admin-categories`)
      .pipe(catchError(this.handleError));
  }

  getCategory(id: number) {
    return this.http
      .get<Category>(`${env.BASE_URL}/admin-category/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCategory(category: any) {
    return this.http
      .post<any>(`${env.BASE_URL}/create-category`, category)
      .pipe(catchError(this.handleError));
  }

  updateCategory(category: any, id: number) {
    return this.http
      .post<any>(`${env.BASE_URL}/update-category/${id}`, category)
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: number) {
    return this.http
      .delete<any>(`${env.BASE_URL}/delete-category/${id}`)
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
