import {Component, Input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import {Question} from "../../models/question";

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatIconModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  @Input() question: Question | undefined;
}
