import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AnswerDialogComponent} from "./components/answer-dialog/answer-dialog.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {NoopAnimationDriver} from "@angular/animations/browser";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterOutlet,
      FormsModule,
      CommonModule,
      AnswerDialogComponent,
      HttpClientModule,
      ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui';
}
