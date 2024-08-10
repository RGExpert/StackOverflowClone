import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Question} from "../models/question";
import {Answer} from "../models/answer";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

    private apiUrl = 'http://localhost:8080/images';
    private httpClient: HttpClient | undefined;
    private httpHeaders: HttpHeaders | undefined;
    private token: string | null = localStorage.getItem('token');

  constructor(private sanitizer: DomSanitizer) {
      this.httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  }

  setHttpClient(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  loadImage(imageName: string): Observable<SafeUrl> {
    return this.getImage(imageName).pipe(
      map((blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    );
  }

  getImage(imageName: string): Observable<Blob> {
    if (!this.httpClient) {
      throw new Error('HttpClient is not set. Call setHttpClient method first.');
    }
    return this.httpClient.get(`${this.apiUrl}/${imageName}`, {responseType: 'blob'});
  }

  loadQuestionImages(questions: Question[]): void {
    questions.forEach(question => {
      if (question.imagePath) {
        this.loadImage(question.imagePath).subscribe(
          safeUrl =>
            question.safeUrl = safeUrl
        );
      }
    });
  }

  loadAnswerImages(answers: Answer[]):void{
    answers.forEach(answer =>{
      if(answer.imagePath){
        this.loadImage(answer.imagePath).subscribe(
          safeUrl =>
            answer.safeUrl=safeUrl
        )}
    })
  }

  uploadImage(file: File | null, headers: any): String | null {
    console.log(file,'\n',this.httpClient);
    const header = (headers)? headers : this.httpHeaders;
    if (this.httpClient && file) {
      const data: FormData = new FormData();
      data.append('file', file);
      const newRequest = new HttpRequest('POST', 'http://localhost:8080/images/upload', data, {
        reportProgress: true,
        responseType: 'text',
        headers: header
      });
      this.httpClient.request(newRequest).subscribe(res =>
        console.log(res)
      )
      return file.name
    } else {
      return null;
    }
  }
}
