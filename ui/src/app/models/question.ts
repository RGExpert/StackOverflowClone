import {User} from "./user";
import {SafeUrl} from "@angular/platform-browser";
import {Tag} from "./tags";

export interface Question {
  formattedCreationDate?:string,
  qid? : number;
  userId?: User;
  title: string ;
  text: string;
  creationDate: string;
  imagePath:string | null;
  safeUrl? : SafeUrl;
  tags?: Tag[];
}
