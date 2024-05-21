import {Component, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})

export class LoginViewComponent {
  hide = true;
  username: string = '';
  password: string = '';
  token: string = ""

  banned: Boolean | undefined;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  login(){
    let url = 'http://localhost:8080/auth/login'
    this.http.
    post<any>(url,{
      username: this.username,
      password: this.password
    }).subscribe(res =>{
      if(res){
        console.log(res);
        this.token = res.accessToken
        this.banned = res.banned;
        localStorage.setItem(
          'token',
          this.token
        );

        if(!this.banned) {
          this.router.navigate(['/home']);
        }
      } else {
        console.log("Authentication failed"); // Maybe do something else here
      }
    })
  }
}
