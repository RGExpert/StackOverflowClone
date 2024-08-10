import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Question} from "../models/question";
import { Tag} from "../models/tags";
import {forkJoin, mergeAll, mergeMap, Observable, toArray} from "rxjs";
import {map} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {User} from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {

    private urls: Map<string, string> = new  Map([
        ['getAll', 'http://localhost:8080/questions/getAll'],
        ['getTags', `http://localhost:8080/tags/GetForQid/{id}`],
        ['getRating', `http://localhost:8080/questions/getRating/{id}`],
        ['getUserRating', `http://localhost:8080/users/userQuestionRating/{id}`],
        ['deleteQuestion', 'http://localhost:8080/questions/deleteQuestion'],
        ['updateQuestion', 'http://localhost:8080/questions/updateQuestion'],
        ['updateTags', `http://localhost:8080/tags/addTagsToQuestion/{id}`]
    ]);

    private token: string | null = localStorage.getItem('token');
    private httpHeaders: HttpHeaders | undefined;

    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
    ) {
        this.httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    }

    private getAll(): Observable<Question[]> {
        return this.http.get<Question[]>(
            this.urls.get('getAll')!,
            {headers: this.httpHeaders}
        )
    }

    private getTags(id: number): Observable<Tag[]> {
        return this.http.get<Tag[]>(
            this.urls.get('getTags')!.replace('{id}',String(id)),
            {headers: this.httpHeaders}
        )
    }

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

    getAllQuestions(): Observable<Question[]> {
        return this.getAll().pipe(
            mergeAll(),

            mergeMap(question =>
                forkJoin({
                    tags: this.getTags(question.qid),
                    rating: this.getRating(question.qid),
                    userRating: this.getUserRating(question.qid)
                }).pipe(
                    map(result => {
                        question.tags = result.tags;
                        question.overallRating = result.rating;
                        question.userRating = result.userRating;
                        question.formattedCreationDate = <string>this.datePipe.transform(question.creationDate, 'medium');
                        return question;
                    }))),

            toArray(),
        )
    }

    deleteQuestion(qId: number) {
        const params = new HttpParams().set('id', String(qId));
        return this.http.delete(
            this.urls.get('deleteQuestion')!,
            {headers: this.httpHeaders, params: params}
        )
    }

    updateQuestion(qId: number, currentUser: User, imagePath: String | null, title: string, text: string) {
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
        return this.http.put(
            this.urls.get('updateQuestion')!,
            {
                qid: qId,
                userId: currentUser,
                creationDate: formattedDate,
                title: title,
                text: text,
                imagePath: imagePath,
            },
            {headers: this.httpHeaders}
        )
    }

   updateTags(tags: Tag[], qId: number) {
        return this.http.post(
            this.urls.get('updateTags')!.replace('{id}', String(qId)),
            tags.map(tag => tag.tagName),
            {headers: this.httpHeaders}
        )
   }





}
