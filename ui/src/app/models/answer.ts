export class Answer {
  aId : number;
  qId: number;
  authorId: number ;
  text: string;
  creationDate: string;

  constructor(aId: number, qId: number, authorId: number, text: string, creationDate: string) {
    this.aId = aId;
    this.qId = qId;
    this.authorId = authorId;
    this.text = text;
    this.creationDate = creationDate;
  }
}
