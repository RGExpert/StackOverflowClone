import {Component, Inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";

@Component({
  selector: 'app-question-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.css'
})
export class QuestionDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<QuestionDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {title : string, text : string },
    ) {}


  onNoClick() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
