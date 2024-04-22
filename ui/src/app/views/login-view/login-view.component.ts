import {Component, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import mockData from "../../constants/mock-data";
import {Router} from "@angular/router";
import {User} from "../../models/user";

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})

export class LoginViewComponent {
  hide = true;
  username: string = '';
  password: string = '';
  constructor(private router: Router) { }

  login() {
    // Your login logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    const user: User | undefined = mockData.users.find(u => u.username === this.username && u.password === this.password);
    if (user) {
      this.router.navigate(['/home']);
      localStorage.setItem('userId', user.id.toString());
    } else {
      console.log('Authentication failed. Invalid username or password.');
    }
  }
}
