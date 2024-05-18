import { Routes } from '@angular/router';
import {LoginViewComponent} from "./views/login-view/login-view.component";
import {HomeViewComponent} from "./views/home-view/home-view.component";
import {UserViewComponent} from "./views/user-view/user-view.component";
import {QuestionsViewComponent} from "./views/questions-view/questions-view.component";
import {AnswersViewComponent} from "./views/answers-view/answers-view.component";
import {RegisterViewComponent} from "./views/register-view/register-view.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginViewComponent, pathMatch: 'full'},
  {path: 'register', component: RegisterViewComponent, pathMatch: 'full'},
  {path:'home', component: HomeViewComponent, pathMatch: 'full'},
  {path:'user/:userId', component: UserViewComponent, pathMatch: 'full'},
  {path: 'questions', component: QuestionsViewComponent, pathMatch:'full'},
  {path: 'questions/:qId', component: AnswersViewComponent, pathMatch:'full'},
];

