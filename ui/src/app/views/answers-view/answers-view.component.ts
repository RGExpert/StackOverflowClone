import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule, DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Question} from "../../models/question";
import {ActivatedRoute, Router} from "@angular/router";
import mockData from "../../mockdata/mock-data";
import {Answer} from "../../models/answer";
import {User} from "../../models/user";
import {AnswerDialogComponent} from "../../components/answer-dialog/answer-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ImageService} from "../../services/image.service";
import {MatChip} from "@angular/material/chips";
import {Tag} from "../../models/tags";
import {translateExpression} from "@angular/compiler-cli/src/ngtsc/translator";


@Component({
  selector: 'app-question-view',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    AnswerDialogComponent,
    MatChip
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './answers-view.component.html',
  styleUrl: './answers-view.component.css'
})
export class AnswersViewComponent implements OnInit {
  question: Question | undefined;
  currentUser: User | undefined;
  answers: Answer[] = [];
  users: User[] = [];
  qId: number | undefined;
  token: string | null = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private http: HttpClient,
              private imageService: ImageService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.qId = parseInt(<string>params.get('qId'));
      this.token = localStorage.getItem('token');

      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      this.http.get<User>('http://localhost:8080/users/principal', {headers})
        .subscribe(res => {
          this.currentUser = res as User;
        });

      if (this.qId) {
        const url = `http://localhost:8080/questions/getById/${this.qId}`
        this.http.get<Question>(url, {headers}).subscribe(
          res => {
            this.question = res as Question;
            this.question.formattedCreationDate = <string>this.datePipe.transform(this.question.creationDate, 'medium');

            const url_tags = `http://localhost:8080/tags/GetForQid/${this.question.qid}`;
            this.http.get<Tag[]>(url_tags, {headers}).subscribe(
              res => {
                if (this.question) {
                  this.question.tags = res;
                }
              }
            )

            if (this.question && this.question.imagePath) {
              this.imageService.loadImage(this.question.imagePath).subscribe(
                safeUrl => {
                  if (this.question) {
                    this.question.safeUrl = safeUrl
                  }
                }
              );
            }
            const url_answers = `http://localhost:8080/answers/question/${this.question.qid}`;
            this.http.get<Answer[]>(url_answers, {headers}).subscribe(
              res => {
                this.answers = res;
                this.answers = this.answers.map(ans => {
                  return {
                    ...ans,
                    creationDate: <string>this.datePipe.transform(ans.creationDate, 'medium')
                  };
                });
                this.imageService.loadAnswerImages(this.answers);
                console.log(this.answers);
              }
            )
          }
        )
      }
    });


  }

  getUserNameAnswer(user: User): string {
    return user ? user.userName : 'Deleted User';
  }

  getUserNameQuestion(authorId: number | undefined): string {
    const user = this.currentUser;
    return user ? user.userName : 'Deleted User';
  }

  goToUserPage(user: User | undefined) {
    if (user) {
      this.router.navigate(['/user', user.id]);
    }
  }

  openDialog() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const dialogRef = this.dialog.open(AnswerDialogComponent, {
      data:
        {
          text: '',
          selectedFile: null,
        }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.text != '') {
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
        let image_path = this.imageService.uploadImage(result.selectedFile, headers)

        this.http.post("http://localhost:8080/answers/addAnswer",
          {
            userId: this.currentUser,
            creationDate: formattedDate,
            questionId: this.question,
            imagePath: image_path,
            text: result.text,
          },
          {headers}
        ).subscribe(res => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['/questions', this.question?.qid]);
          })
        })

        //mockData.answers.push(ans);
        //this.answers.push(ans);
      }
    });
  }

  deleteAnswer(answer: Answer) {
    this.answers.filter(ans => ans != answer);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    let params;
    if (answer.answerId) {
      params = new HttpParams().set('id', answer.answerId?.toString());
    }
    this.http.delete("http://localhost:8080/answers/deleteAnswer", {headers, params}).subscribe(
      res => {
        console.log("Successful deletion");
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate(['/questions', this.question?.qid]);
        })
      }
    )
  }

  updateAnswer(answer: Answer) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const dialogRef = this.dialog.open(AnswerDialogComponent,
      {
        data:
          {
            text: answer.text,
            selectedFile: null,
          }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result && result.text != '') {
        answer.text = result;
        let image_path: String | null = null;

        if (result.selectedFile != null) {
          image_path = this.imageService.uploadImage(result.selectedFile, headers)
        }
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');

        this.http.put("http://localhost:8080/answers/updateAnswer",
          {
            answerId:answer.answerId,
            userId: this.currentUser,
            imagePath: image_path,
            currentDate: formattedDate,
            questionId: this.question,
            text: result.text
          },
          {headers})
          .subscribe(res => {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(['/questions', this.question?.qid]);
            })
          }
        )
        ;
      }
    });
  }
}
