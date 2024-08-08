import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private urls: Map<string, string> = new  Map([
        ['getById', `http://localhost:8080/users/getById/{id}`],
        ['getUserScore', `http://localhost:8080/users/getUserScore/{userScore}`]
    ]);

    private token: string | null = localStorage.getItem('token');
    private httpHeaders: HttpHeaders | undefined;

    constructor(private http: HttpClient) {
        this.httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    }

    private getUserById(id: number): Observable<User> {
        return this.http.get<User>(
            this.urls.get('getById')!.replace('{id}', String(id)),
            {headers: this.httpHeaders}
        );
    }

    private getUserScoreById(id: number): Observable<number> {
        return this.http.get<number>(
            this.urls.get('getUserScore')!.replace('{userScore}', String(id)),
            {headers: this.httpHeaders}
        );
    }

    getUserByIdWithScore(id: number): Observable<User> {
        return this.getUserById(id).pipe(
            switchMap(user =>
                this.getUserScoreById(id).pipe(
                    map(score => {
                        user.score = score;
                        return user;
                    })
                )
            )
        );
    }
}
