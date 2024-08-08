import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginUrl : string = 'http://localhost:8080/auth/login';
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(this.loginUrl, {username, password})
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(() => new Error('Login Failed'));
    }
}
