import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Comment } from '../models/comment';

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient) {}

  getComments() {
    return this.http
      .get<Array<Comment>>(`${env.BASE_URL}/comments`)
      .pipe(catchError(this.handleError));
  }

  createComment(body: any) {
    return this.http.post<Comment>(`${env.BASE_URL}/create-comment`, body);
  }

  updateComment(id: string, text: string) {
    return this.http.post<[status: string, data: Comment]>(
      `${env.BASE_URL}/update-comment/${id}`,
      {
        body: text,
      }
    );
  }

  deleteComment(id: string) {
    return this.http
      .delete<any>(`${env.BASE_URL}/delete-comment/${id}`)
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
