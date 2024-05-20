import {Component, Inject} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialog,MAT_DIALOG_DATA, MatDialogModule, MatDialogRef,MatDialogTitle,MatDialogContent,MatDialogActions,MatDialogClose,} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {Answer} from "../../models/answer";

@Component({
  selector: 'app-answer-dialog',
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
  templateUrl: './answer-dialog.component.html',
  styleUrl: './answer-dialog.component.css',
})

export class AnswerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {text: string, selectedFile: File | null},
  ) {}

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.data.selectedFile = files[0];
    }
  }

  onNoClick() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    this.dialogRef.close(this.data);
  }
}
