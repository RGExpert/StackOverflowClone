export class Question {
  qId : number;
  authorId: number;
  title: string ;
  text: string;
  creationDate: string;

  constructor(qId: number, authorId: number, title: string, text: string, creationDate: string) {
    this.qId = qId;
    this.authorId = authorId;
    this.title = title;
    this.text = text;
    this.creationDate = creationDate;
  }
}
