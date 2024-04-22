import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Question} from "../../models/question";
import {ActivatedRoute} from "@angular/router";
import mockData from "../../constants/mock-data";
import {Answer} from "../../models/answer";
import {User} from "../../models/user";


@Component({
  selector: 'app-question-view',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './question-view.component.html',
  styleUrl: './question-view.component.css'
})
export class QuestionViewComponent implements OnInit{
  question: Question | undefined = undefined ;
  answers: Answer[] = [];
  users: User[] =[];
  qId : string | null = null;

  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.qId = params.get('qId');
    });

    if (this.qId){
      const qIdNumber = parseInt(this.qId, 10);
      this.question = mockData.questions.find(q => q.qId === qIdNumber);
      this.answers = mockData.answers.filter(a => a.qId === qIdNumber);
    }

  }

  getUserName(authorId: number): string {
    const user = mockData.users.find(u => u.id === authorId);
    return user ? user.username : 'Deleted User';
  }
}
