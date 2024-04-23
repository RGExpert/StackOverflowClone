import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AnswerDialogComponent} from "../answer-dialog/answer-dialog.component";
import {QuestionDialogComponent} from "../question-dialog/question-dialog.component";
import {resolve} from "@angular/compiler-cli";
import {Question} from "../../models/question";
import mockData from "../../mockdata/mock-data";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog) { }
  counter : number = 424;
  toggleMenu() {
    // Implement toggle logic for menu
  }

  navigateToUserPage() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['/user',userId]);
  }

  navigateToQuestionsPage() {
    this.router.navigate(['/questions']);
  }

  addNewQuestion() {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {data: { title: '', text: '' }});
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result.tex !='' && result.title !=''){
          this.counter++;
          const currentDate: Date = new Date();
          const formattedDate: string = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
          const userId = parseInt(<string>localStorage.getItem('userId'));
          let q = <Question>{
            qId: this.counter,
            authorId: userId,
            creationDate: formattedDate,
            title: result.title,
            text: result.text,
            path:'./assets/placeholder.jpg',
          };
          mockData.questions.push(q);
          this.router.navigate(['/questions',this.counter]);
        }
    });
  }
}
