import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUrl: string = '';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post<any>(`${env.BASE_URL}/login`, { username, password })
      .pipe(
        map((user) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }),
        catchError(this.handleError)
      );
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  getRole(): number | null {
    const user = localStorage.getItem('currentUser');
    if (user?.length) {
      const currentUser = JSON.parse(user);
      return currentUser.role;
    }
    return null;
  }

  getAuthorizationToken() {
    const user = localStorage.getItem('currentUser');
    if (user?.length) {
      const currentUser = JSON.parse(user);
      return currentUser.token;
    }
    return null;
  }

  getLoggedInUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const currentUser = JSON.parse(user);
      return currentUser;
    }

    return null;
  }

  updateLoggedInUserName(name: string) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const currentUser = JSON.parse(user);
      currentUser.name = name;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }

  redirectTo() {
    let role = this.getRole();

    if (role == 1) {
      return '/admin';
    }

    if (role == 2) {
      return '/user';
    }

    return '';
  }

  logout() {
    localStorage.removeItem('currentUser');
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
