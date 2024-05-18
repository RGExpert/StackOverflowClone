import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Question} from "../../models/question";
import {ActivatedRoute, Router} from "@angular/router";
import mockData from "../../mockdata/mock-data";
import {Answer} from "../../models/answer";
import {User} from "../../models/user";
import {AnswerDialogComponent} from "../../components/answer-dialog/answer-dialog.component";
import {MatDialog} from "@angular/material/dialog";



@Component({
  selector: 'app-question-view',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    AnswerDialogComponent
  ],
  templateUrl: './answers-view.component.html',
  styleUrl: './answers-view.component.css'
})
export class AnswersViewComponent implements OnInit{
  question: Question | undefined;
  currentUser: number | undefined;
  answers: Answer[] = [];
  users: User[] =[];
  qId : number | undefined;

  counter : number = 5;

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.qId = parseInt(<string>params.get('qId'));
      this.currentUser = parseInt(<string>localStorage.getItem('userId'),10);
      console.log(this.currentUser);
    });

    if (this.qId){
      this.question = mockData.questions.find(q => q.qId === this.qId) as Question;
      this.answers = mockData.answers.filter(a => a.qId === this.qId) as Answer[];
    }

  }

  getUserNameAnswer(authorId: number): string {
    const user = mockData.users.find(u => u.id === authorId);
    return user ? user.userName : 'Deleted User';
  }

  getUserNameQuestion(authorId: number | undefined): string {
    const user = mockData.users.find(u => u.id === authorId);
    return user ? user.userName : 'Deleted User';
  }

  goToUserPage(authorId: number | undefined) {
    this.router.navigate(['/user',authorId]);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AnswerDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        this.counter++;
        const currentDate: Date = new Date();
        const formattedDate: string = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        let ans =<Answer>{ aId: this.counter,
                            authorId: this.currentUser,
                            creationDate: formattedDate,
                            qId: this.qId,
                            text: result};
        mockData.answers.push(ans);
        this.answers.push(ans);
      }
    });
  }

  deleteAnswer(answer: Answer) {
    mockData.answers = mockData.answers.filter(a => a != answer);
    this.answers = this.answers.filter(a => a != answer);
  }

  updateAnswer(answer: Answer) {
    const dialogRef = this.dialog.open(AnswerDialogComponent, {data:answer.text});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result){
        answer.text = result;
      }
    });
  }
}
