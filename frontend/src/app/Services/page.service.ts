import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private http: HttpClient) {}

  getPages() {
    return this.http
      .get<Array<Page>>(`${env.BASE_URL}/admin-pages`)
      .pipe(catchError(this.handleError));
  }

  getPage(id: number) {
    return this.http
      .get<Page>(`${env.BASE_URL}/admin-page/${id}`)
      .pipe(catchError(this.handleError));
  }

  createPage(page: any) {
    return this.http
      .post<any>(`${env.BASE_URL}/create-page`, page)
      .pipe(catchError(this.handleError));
  }

  updatePage(page: any, id: number) {
    return this.http
      .post<any>(`${env.BASE_URL}/update-page/${id}`, page)
      .pipe(catchError(this.handleError));
  }

  deletePage(id: number) {
    return this.http
      .delete<any>(`${env.BASE_URL}/delete-page/${id}`)
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
