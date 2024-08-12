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
import {QuestionService} from "../../services/question.service";
import {UserService} from "../../services/user.service";
import {AnswerService} from "../../services/answer.service";


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
    qId: number | null = null;
    token: string | null = null;

    constructor(private route: ActivatedRoute,
                private router: Router,
                public dialog: MatDialog,
                private http: HttpClient,
                private imageService: ImageService,
                private datePipe: DatePipe,
                private questionService: QuestionService,
                private userService: UserService,
                private answerService: AnswerService,
    ) { }

    ngOnInit(): void {
        this.qId = Number(this.route.snapshot.paramMap.get('qId'));
        this.token = localStorage.getItem('token');

        this.userService.getUserByPrincipal().subscribe( response => this.currentUser = response);

        if (!this.qId) {
            throw new Error('Question does not exist');
        }

        this.questionService.getQuestionById(this.qId).subscribe(response => {
                this.question = response;
                this.imageService.loadQuestionImages([this.question]);
            }
        )

        this.answerService.getAllAnswers(this.qId!).subscribe(response =>{
            this.answers = response;
            this.answers.sort(this.answerService.compareAnswers);
            this.imageService.loadAnswerImages(this.answers);
        })
    }

    goToUserPage(user: User | undefined) {
        if (user) {
            console.log(user);
            this.router.navigate(['/user', user.userId]);
        }
    }

    openDialog() {
        const dialogRef = this.dialog.open(AnswerDialogComponent, {
            data: {
                text: '',
                selectedFile: null,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined || !result || result.text == '') {
                return
            }

            const imagePath: String | null = this.imageService.uploadImage(result.selectedFile, null);

            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.answerService.postAnswer(this.currentUser!, this.question!, result.text, imagePath).subscribe(()=> {
                    this.router.navigate(['/questions', this.question?.qid]);
                })
            })
        });
    }

    deleteAnswer(answer: Answer) {
        this.answers.filter(ans => ans != answer);

        this.answerService.deleteAnswer(answer.answerId!).subscribe(
            res => {
                console.log("Successful deletion");
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate(['/questions', this.question?.qid]);
                })
            }
        )
    }

    updateAnswer(answer: Answer) {
        const dialogRef = this.dialog.open(AnswerDialogComponent,
            {
                data: {
                    text: answer.text,
                    selectedFile: null,
                }
            });

        dialogRef.afterClosed().subscribe(result => {
            if (!result || result.text == '') {
                return;
            }

            const imagePath: String | null = this.imageService.uploadImage(result.selectedFile, null);

            this.answerService.updateAnswer(answer, this.currentUser!, this.question!, result.text, imagePath).subscribe(res => {
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this.router.navigate(['/questions', this.question?.qid]);
                })
            });
        });
    }

    postLike(question: Question) {
        this.questionService.postLike(question);
    }

    postDisLike(question: Question) {
        this.questionService.postDislike(question);
    }

    postLikeAnswer(answer: Answer) {
        this.answerService.postLike(answer);
    }

    postDisLikeAnswer(answer: Answer) {
        this.answerService.postDislike(answer);
    }


}
