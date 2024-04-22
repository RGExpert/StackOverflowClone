import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {Question} from "../../models/question";
import mockData from "../../constants/mock-data";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {Router} from "@angular/router";

@Component({
  selector: 'app-questions-view',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './questions-view.component.html',
  styleUrl: './questions-view.component.css'
})
export class QuestionsViewComponent implements OnInit{
  questions: Question[] =[];

  constructor(private router: Router) { }
  ngOnInit(): void {
    this.questions=mockData.questions;
  }

  navigateToQuestion(qId: any) {
    this.router.navigate(['/questions',qId]);
  }
}
