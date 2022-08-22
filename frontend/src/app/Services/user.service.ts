import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  checkUsername(username: string) {
    return this.http
      .post<boolean>(`${env.BASE_URL}/check-username`, { username: username })
      .pipe(catchError(this.handleError));
  }

  createUser(user: any) {
    return this.http
      .post<any>(`${env.BASE_URL}/create-user`, user)
      .pipe(catchError(this.handleError));
  }

  getUsers(page: number, limit: number) {
    const httpParams = new HttpParams().set('page', page).set('limit', limit);

    return this.http
      .get<Array<User>>(`${env.BASE_URL}/admin-users`, {
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  activateUser(data: any) {
    return this.http
      .post<any>(`${env.BASE_URL}/activate-user`, data)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number) {
    return this.http
      .delete<any>(`${env.BASE_URL}/delete-user/${id}`)
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
