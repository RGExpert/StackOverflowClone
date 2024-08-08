import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginUrl : string = 'http://localhost:8080/auth/login';
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(this.loginUrl, {username, password});
    }
}
