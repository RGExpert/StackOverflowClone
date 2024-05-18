import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.css'
})

export class RegisterViewComponent {
  username: any;
  password: any;
  confirmPassword: any;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  user: User | undefined;
  register() {
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString().replace(/\.\d{3}Z$/, '');
    this.user =  {
      userName: this.username,
      password: this.password,
      joinDate: formattedDate,
      role: {
        roleId: 1,
        roleName: "USER"
      }
    }

    let url = 'http://localhost:8080/users/addUser'

    this.http.post<any>(
      url,
      this.user
    ).subscribe( res =>{
      if(res){
        this.router.navigate(['/login']);
      }else {
        console.log("User creation error");
      }
    });

  }
}
