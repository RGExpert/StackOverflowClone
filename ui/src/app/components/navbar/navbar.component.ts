import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {ImageService} from "../../services/image.service";
import {Tag} from "../../models/tags";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
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
  ) {
  }

  token: string | null = "";
  tags: Tag[] = [];

  currentUser: User | undefined;

  toggleMenu() {
    // Implement toggle logic for menu
  }

  navigateToUserPage() {
    console.log(this.currentUser)
    if(this.currentUser){
      console.log(this.currentUser)
      this.router.navigate(['/user', this.currentUser.userId]);
    }
  }

  navigateToQuestionsPage() {
    this.router.navigate(['/questions']);
  }

  addNewQuestion() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    //console.log(this.tags);

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

        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
        //console.log(this.token);

        this.currentUser = await lastValueFrom(this.http.get<User>('http://localhost:8080/users/principal', {headers}))
        //console.log(this.currentUser);;
        //console.log(uid);

        //console.log("selectedFile: ", result.selectedFile)
        let image_path = this.imageService.uploadImage(result.selectedFile, headers)

        await lastValueFrom(this.http.post("http://localhost:8080/questions/addQuestion",
          {
            userId: this.currentUser,
            creationDate: formattedDate,
            title: result.title,
            text: result.text,
            imagePath: image_path,
          },
          {headers})).then((questionResponse: any) => {
          const questionId = questionResponse['qid'];
          const url = `http://localhost:8080/tags/addTagsToQuestion/${questionId}`;
          return this.http.post(url, this.tags?.map(tag => tag.tagName), {headers}).toPromise();
        })
          .then(() => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(["/questions"]);
            });
          })
      }
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    this.http.get<User>('http://localhost:8080/users/principal', {headers}).subscribe(res =>{
      this.currentUser = res
    });
    this.imageService.setHttpClient(this.http);

  }
}
