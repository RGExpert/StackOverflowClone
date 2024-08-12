import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {forkJoin, mergeAll, mergeMap, Observable, toArray} from "rxjs";
import {Answer} from "../models/answer";
import {map} from "rxjs/operators";
import {User} from "../models/user";
import {Question} from "../models/question";

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

    private token: string | null = localStorage.getItem('token');
    private httpHeaders: HttpHeaders | undefined;

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
    ) {
        this.httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    }

    private urls: Map<string, string> = new  Map([
        ['getAnswers', `http://localhost:8080/answers/question/{id}`],
        ['getRating', `http://localhost:8080/answers/getRating/{id}`],
        ['getUserRating', `http://localhost:8080/users/userAnswerRating/{id}`],
        ['getUserScore', `http://localhost:8080/users/getUserScore/{id}`],
        ['postRating', `http://localhost:8080/users/updateAnswerRating/{id}`],
        ['postAnswer', `http://localhost:8080/answers/addAnswer`],
        ['deleteAnswer', `http://localhost:8080/answers/deleteAnswer`],
        ['updateAnswer', `http://localhost:8080/answers/updateAnswer`],
    ]);


    private getRating(id: number): Observable<number> {
        return this.http.get<number>(
            this.urls.get('getRating')!.replace('{id}',String(id)),
            {headers: this.httpHeaders}
        )
    }

    private getUserRating(id: number): Observable<Boolean | null> {
        return this.http.get<Boolean | null>(
            this.urls.get('getUserRating')!.replace('{id}',String(id)),
            {headers: this.httpHeaders}
        )
    }

    private getUserScore(userId: number): Observable<number> {
        return this.http.get<number>(
            this.urls.get('getUserRating')!.replace('{id}',String(userId)),
            {headers: this.httpHeaders}
        )
    }

    private getAnswers(id: number): Observable<Answer[]> {
        return this.http.get<Answer[]>(
            this.urls.get('getAnswers')!.replace('{id}', String(id)),
            {headers: this.httpHeaders}
        )
    }

    private populateAnswer(answer: Answer): Observable<Answer> {
        return forkJoin([
            this.getRating(answer.answerId),
            this.getUserRating(answer.answerId),
            this.getUserScore(answer.userId.userId!),
        ]).pipe(
            map(([rating, userRating, userScore]) => {
                answer.overallRating = rating;
                answer.userRating = userRating;
                answer.userId.score = userScore;
                answer.creationDate = <string>this.datePipe.transform(answer.creationDate, 'medium');
                return answer;
            })
        )
    }

    compareAnswers(a: Answer, b: Answer): number{
        if (a.overallRating != null && b.overallRating != null) {
            return b.overallRating - a.overallRating;
        } else if (a.overallRating != null) {
            return -1;
        } else if (b.overallRating != null) {
            return 1;
        } else {
            return 0;
        }
    }

    getAllAnswers(id: number): Observable<Answer[]> {
        return this.getAnswers(id).pipe(
            mergeAll(),
            mergeMap(answer => this.populateAnswer(answer)),
            toArray(),
        );
    }

    postAnswer(user: User, question: Question, text: string, imagePath: String | null){
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
        return this.http.post(
            this.urls.get('postAnswer')!,
            {
                userId: user,
                creationDate: formattedDate,
                questionId: question,
                imagePath: imagePath,
                text: text,
            },
            {headers: this.httpHeaders}
        )
    }

    updateAnswer(answer: Answer, user: User, question: Question, text: string, imagePath: String | null){
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
        return this.http.put(
            this.urls.get('updateAnswer')!,
            {
                answerId: answer.answerId,
                userId: user,
                creationDate: formattedDate,
                questionId: question,
                imagePath: imagePath,
                text: text,
            },
            {headers: this.httpHeaders}
        )
    }

    postLike(answer: Answer) {
        this.http.put(
            this.urls.get('postRating')!.replace('{id}',String(answer.answerId)),
            {rating: (answer.userRating == true) ? null : true},
            {headers: this.httpHeaders}
        ).subscribe(() =>{
            answer.overallRating = (answer.userRating == true) ? answer.overallRating - 1 : (answer.userRating == false) ? answer.overallRating + 2 : answer.overallRating + 1;
            answer.userRating = (answer.userRating == true) ? null : true;
        })
    }

    postDislike(answer: Answer) {
        this.http.put(
            this.urls.get('postRating')!.replace('{id}',String(answer.answerId)),
            {rating: (answer.userRating == false) ? null : false},
            {headers: this.httpHeaders}
        ).subscribe(() =>{
            answer.overallRating = (answer.userRating == false) ? answer.overallRating + 1 : (answer.userRating == true) ? answer.overallRating - 2 : answer.overallRating - 1;
            answer.userRating = (answer.userRating == false) ? null : false;
        })
    }

    deleteAnswer(id: number){
        const params = new HttpParams().set('id', String(id));
        return this.http.delete(
            this.urls.get('deleteAnswer')!,
            {
                headers: this.httpHeaders,
                params: params,
            }
        )
    }
}
