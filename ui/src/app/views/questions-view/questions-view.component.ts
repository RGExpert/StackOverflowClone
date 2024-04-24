import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {Question} from "../../models/question";
import mockData from "../../mockdata/mock-data";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {QuestionDialogComponent} from "../../components/question-dialog/question-dialog.component";
import {QuestionCardComponent} from "../../components/question-card/question-card.component";

@Component({
  selector: 'app-questions-view',
  standalone: true,
  imports: [NavbarComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    QuestionCardComponent
  ],
  templateUrl: './questions-view.component.html',
  styleUrl: './questions-view.component.css'
})
export class QuestionsViewComponent implements OnInit{
  questions: Question[] =[];

  currentUser: number | undefined;

  constructor(private router: Router, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.questions = mockData.questions as Question[];
    this.currentUser = parseInt(<string>localStorage.getItem("userId"));
  }

  navigateToQuestion(qId: any) {
    this.router.navigate(['/questions',qId]);
  }


  deleteQuestion(question: Question) {
    mockData.questions = mockData.questions.filter(q => q.qId != question.qId);
    this.questions = this.questions.filter(q => q.qId != question.qId);
  }

  updateQuestion(question: Question) {
    const dialogRef = this.dialog.open(QuestionDialogComponent,
      {data: { title: question.title, text: question.text }});

    dialogRef.afterClosed().subscribe(result =>{
      if(result.text != '' && result.title !=''){
        question.text = result.text;
        question.title = result.title;
      }
    });
  }
}
