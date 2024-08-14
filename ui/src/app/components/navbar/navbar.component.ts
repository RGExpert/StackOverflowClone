import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ImageService} from "../../services/image.service";
import {Tag} from "../../models/tags";
import {CommonModule, NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {QuestionService} from "../../services/question.service";


@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private http: HttpClient,
        private imageService: ImageService,
        private userService: UserService,
        private questionService: QuestionService,
    ) {
    }

    token: string | null = "";
    tags: Tag[] = [];

    currentUser: User | undefined;

    navigateToUserPage() {
        if(this.currentUser){
            this.router.navigate(['/user', this.currentUser.userId]);
        }
    }

    navigateToQuestionsPage() {
        this.router.navigate(['/questions']);
    }

    addNewQuestion() {
        const dialogRef = this.dialog.open(QuestionDialogComponent, {
            data: {
                title: '',
                text: '',
                selectedFile: '',
                tags: this.tags
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result && result.text != '' && result.title != '') {
                let image_path: String | null = this.imageService.uploadImage(result.selectedFile, null);

                this.questionService.postQuestion(this.currentUser!, image_path, result.title, result.text, this.tags).subscribe(()=> {
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(["/questions"]);
                    });
                })
            }
        });
    }

    ngOnInit(): void {
        this.userService.getUserByPrincipal().subscribe(res =>{
            this.currentUser = res
        });

        this.imageService.setHttpClient(this.http);

    }

    navigateToAllUsersPage() {
        this.router.navigate(['/users']);
    }

    logout() {
        localStorage.clear()
        this.router.navigate(['/login'])
    }
}
