import {Component, inject, Inject} from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { Tag } from "../../models/tags";
import { CommonModule } from "@angular/common";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
  ],
  standalone: true
})
export class QuestionDialogComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);
  addOnBlur = true;
  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, text: string, selectedFile: File | null, tags: Tag[]}
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
    //console.log(this.data);
    this.dialogRef.close(this.data);
  }



  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.data.tags.push({tagName: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.data.tags.indexOf(tag);

    if (index >= 0) {
      this.data.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: Tag, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(tag);
      return;
    }

    const index = this.data.tags.indexOf(tag);
    if (index >= 0) {
      this.data.tags[index].tagName = value;
    }
  }

}
