import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule, DatePipe} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Question} from "../../models/question";
import {ActivatedRoute, Router} from "@angular/router";
import {Answer} from "../../models/answer";
import {User} from "../../models/user";
import {AnswerDialogComponent} from "../../components/answer-dialog/answer-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ImageService} from "../../services/image.service";
import {MatChip} from "@angular/material/chips";
import {Tag} from "../../models/tags";
import {forkJoin, lastValueFrom} from "rxjs";


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
          console.log(res);
        });

      if (this.qId) {
        const url = `http://localhost:8080/questions/getById/${this.qId}`
        this.http.get<Question>(url, {headers}).subscribe(
          res => {
            this.question = res as Question;
            if (this.question.userId) {
              const userScoreUrl = `http://localhost:8080/users/getUserScore/${this.question.userId.userId}`;
              this.http.get<number>(userScoreUrl, {headers}).subscribe(
                res => {
                  if (this.question && this.question.userId) {
                    this.question.userId.score = res as number
                  }
                }
              )
            }
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

            const urlRating = `http://localhost:8080/questions/getRating/${this.question.qid}`;
            this.http.get<number>(urlRating, {headers}).subscribe(res => {
              if (this.question) {
                this.question.overallRating = res;
              }
            })

            const urlUserRating = `http://localhost:8080/users/userQuestionRating/${this.question.qid}`;
            this.http.get<Boolean | null>(urlUserRating, {headers}).subscribe(res => {
              if (this.question) {
                this.question.userRating = res;
              }
            });

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


                this.answers.forEach(answer => {
                  const urlRating = `http://localhost:8080/answers/getRating/${answer.answerId}`;
                  const urlUserRating = `http://localhost:8080/users/userAnswerRating/${answer.answerId}`;
                  const userScoreUrl = `http://localhost:8080/users/getUserScore/${answer.userId.userId}`;

                  const ratingRequest = this.http.get<number>(urlRating, {headers});
                  const userRatingRequest = this.http.get<Boolean | null>(urlUserRating, {headers});
                  const userScoreUrlRequest = this.http.get<number>(userScoreUrl, {headers});

                  forkJoin([ratingRequest, userRatingRequest, userScoreUrlRequest]).subscribe(([ratingRes, userRatingRes, userScoreUrlRequest]) => {
                    answer.overallRating = ratingRes;
                    answer.userRating = userRatingRes;
                    answer.userId.score = userScoreUrlRequest;

                    this.answers.sort((answerA, answerB) => {
                      if (answerA.overallRating != null && answerB.overallRating != null) {
                        return answerB.overallRating - answerA.overallRating;
                      } else if (answerA.overallRating != null) {
                        return -1;
                      } else if (answerB.overallRating != null) {
                        return 1;
                      } else {
                        return 0;
                      }
                    });

                  });
                });
              }
            )
          }
        )}
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
      console.log(user);
      this.router.navigate(['/user', user.userId]);
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
            answerId: answer.answerId,
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

  postLike(question: Question) {
    const url = `http://localhost:8080/users/updateQuestionRating/${question.qid}`;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.put(url,
      {
        rating: (question.userRating == true) ? null : true
      },
      {headers}).subscribe(res => {
      if (question.overallRating != undefined) {
        question.overallRating = (question.userRating == true) ? question.overallRating - 1 : (question.userRating == false) ? question.overallRating + 2 : question.overallRating + 1;
      }
      question.userRating = (question.userRating == true) ? null : true;
    });
  }

  postDisLike(question: Question) {
    const url = `http://localhost:8080/users/updateQuestionRating/${question.qid}`;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.put(url,
      {
        rating: (question.userRating == false) ? null : false
      },
      {headers}).subscribe(res => {
      if (question.overallRating != undefined) {
        question.overallRating = (question.userRating == false) ? question.overallRating + 1 : (question.userRating == true) ? question.overallRating - 2 : question.overallRating - 1;
      }
      question.userRating = (question.userRating == false) ? null : false;
    });
  }

  postLikeAnswer(answer: Answer) {
    const url = `http://localhost:8080/users/updateAnswerRating/${answer.answerId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.put(url,
      {
        rating: (answer.userRating == true) ? null : true
      },
      {headers}).subscribe(res => {
      if (answer.overallRating != undefined) {
        answer.overallRating = (answer.userRating == true) ? answer.overallRating - 1 : (answer.userRating == false) ? answer.overallRating + 2 : answer.overallRating + 1;
      }
      answer.userRating = (answer.userRating == true) ? null : true;
    })
  }

  postDisLikeAnswer(answer: Answer) {
    const url = `http://localhost:8080/users/updateAnswerRating/${answer.answerId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.put(url,
      {
        rating: (answer.userRating == false) ? null : false
      },
      {headers}).subscribe(res => {
      if (answer.overallRating != undefined) {
        answer.overallRating = (answer.userRating == false) ? answer.overallRating + 1 : (answer.userRating == true) ? answer.overallRating - 2 : answer.overallRating - 1;
        ;
      }
      answer.userRating = (answer.userRating == false) ? null : false;
    })
  }


}
