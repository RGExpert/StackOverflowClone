import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private registerUrl: string = 'http://localhost:8080/users/addUser'

    constructor(private http: HttpClient) { }

    register(user: User): Observable<User> {
        const currentDate: Date = new Date();
        user.joinDate = currentDate.toISOString().replace(/\.\d{3}Z$/, '');

        return this.http.post<User>(
            this.registerUrl,
            user
        )
    }
}
