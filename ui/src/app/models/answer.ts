import {Question} from "./question";
import {User} from "./user";
import {SafeUrl} from "@angular/platform-browser";

export interface Answer {
  answerId? : number;
  questionId: Question;
  userId:User;
  authorId?: number ;
  imagePath:string | null;
  qid?:number;
  text: string;
  safeUrl? : SafeUrl;
  creationDate: string;
}
