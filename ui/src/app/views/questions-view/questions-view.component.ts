import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {Question} from "../../models/question";
import {CommonModule, Location} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../../components/question-dialog/question-dialog.component";
import {QuestionCardComponent} from "../../components/question-card/question-card.component";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ImageService} from "../../services/image.service";
import {lastValueFrom} from "rxjs";
import {Tag} from "../../models/tags";
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {QuestionService} from "../../services/question.service";

@Component({
    selector: 'app-questions-view',
    standalone: true,
    imports: [NavbarComponent,
        MatCardModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        QuestionCardComponent,
        MatChipsModule,
        FormsModule, MatCheckbox,
    ],
    templateUrl: './questions-view.component.html',
    styleUrl: './questions-view.component.css'
})
export class QuestionsViewComponent implements OnInit, OnChanges {
    questions: Question[] = [];

    filteredQuestions: Question[] = [];
    tagFilter: string = '';
    titleFilter: string = '';
    userFilter: string = '';
    showCurrentUserQuestions: boolean = false;

    currentUser: User | undefined;
    token: string | null = null;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private http: HttpClient,
        private imageService: ImageService,
        private location: Location,
        private userService: UserService,
        private questionService: QuestionService,
    ) {
    }

    ngOnInit(): void {
        this.initializeTokenAndHttpClient();
        if (this.token) {
            this.fetchQuestionsAndUser();
        } else {
            console.log("Null Token");
            this.router.navigate(['/login']);
        }
    }

    initializeTokenAndHttpClient(): void {
        this.token = localStorage.getItem('token');
        this.imageService.setHttpClient(this.http);
    }

    fetchQuestionsAndUser(): void {
        this.questionService.getAllQuestions()
            .subscribe(response =>{
                if (!response) {
                    console.log("Invalid Token");
                    this.router.navigate(['/login']);
                    return;
                }

                this.questions = response;
                this.imageService.loadQuestionImages(this.questions);
                this.applyFilters();
            })


        this.userService.getUserByPrincipal()
            .subscribe(response => this.currentUser = response)
    }

    navigateToQuestion(qId: any) {
        this.router.navigate(['/questions', qId]);
    }

    applyFilters() {
        this.filteredQuestions = this.questions.filter(question => {
            let tagMatch = true;
            if (question.tags) {
                tagMatch = this.tagFilter ? question.tags.some(tag => tag.tagName.toLowerCase().includes(this.tagFilter.toLowerCase())) : true;
            }
            const titleMatch = this.titleFilter ? question.title.toLowerCase().includes(this.titleFilter.toLowerCase()) : true;

            const userMatch = this.userFilter ? question.userId?.userName.toLowerCase().includes(this.userFilter.toLowerCase()) : true;

            const currentUserMatch = this.showCurrentUserQuestions ? question.userId?.userName === this.currentUser?.userName : true;

            return tagMatch && titleMatch && userMatch && currentUserMatch;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.applyFilters()
    }

    deleteQuestion(question: Question) {
        this.questions = this.questions.filter(q => q != question);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        let params;
        if (question.qid) {
            params = new HttpParams().set('id', question.qid?.toString());
        }
        this.http.delete("http://localhost:8080/questions/deleteQuestion", {headers, params}).subscribe(
            res => {
                console.log("Deletion successfully");
            }
        )
        this.applyFilters();

    }

    updateQuestion(question: Question) {
        const auxTags = question.tags?.map(tag => ({...tag}))
        const dialogRef = this.dialog.open(QuestionDialogComponent, {
            data: {
                title: question.title,
                text: question.text,
                selectedFile: null,
                tags: auxTags,
            }
        });
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        dialogRef.afterClosed().subscribe(async result => {
            if (result && result.text != '' && result.title != '') {

                const currentDate: Date = new Date();
                const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');

                this.currentUser = await lastValueFrom(this.http.get<User>('http://localhost:8080/users/principal', {headers}))

                let image_path;
                if (result.selectedFile) {
                    image_path = this.imageService.uploadImage(result.selectedFile, headers)
                }

                await lastValueFrom(this.http.put("http://localhost:8080/questions/updateQuestion",
                    {
                        qid: question.qid,
                        userId: this.currentUser,
                        creationDate: formattedDate,
                        title: result.title,
                        text: result.text,
                        imagePath: image_path,
                    },
                    {headers}))
                    .then((questionResponse: any) => {
                        const questionId = question.qid;
                        const url = `http://localhost:8080/tags/addTagsToQuestion/${questionId}`;
                        return this.http.post(url, result.tags.map((tag: Tag) => tag.tagName), {headers}).toPromise();
                    })
                    .then(() => {
                        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                            this.router.navigate([this.location.path()]);
                        });
                    })
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
                question.overallRating = (question.userRating == false)?
                    question.overallRating + 1 : (question.userRating == true)?
                        question.overallRating - 2 : question.overallRating - 1;
            }
            question.userRating = (question.userRating == false) ? null : false;
        });
    }
}
