import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../../models/user";
import {MatCard, MatCardModule} from "@angular/material/card";
import {CommonModule, NgForOf} from "@angular/common";
import {MatCalendarHeader} from "@angular/material/datepicker";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-user-management-view',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatCalendarHeader,
    MatIconButton,
  ],
  templateUrl: './user-management-view.component.html',
  styleUrl: './user-management-view.component.css'
})
export class UserManagementViewComponent implements OnInit {
  constructor(
    private http: HttpClient,
  ) {
  }

  token: string | null = null;
  users: User[] = [];

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    const getUsersUrl = "http://localhost:8080/users/getAll";
    this.http.get<User[]>(getUsersUrl, {headers}).subscribe(
      res => {
        this.users = res;
        console.log(res);
      }
    )
  }

  banUser(user: User) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    let url = `http://localhost:8080/users/updateUser/${user.userId}`;
    user.banned = 1;
    this.http.put(url, 1,
      {headers}).subscribe(res => user.banned = 1)

    let emailUrl = "http://localhost:8080/sendMail";
    this.http.post(emailUrl,
      {
        recipient:user.email,
        msgBody:"You got BANNED from totally legit stackoverflow",
        subject:"Totally legit stackoverflow BAN",
      },
      {headers}).subscribe()
  }

  unBanUser(user: User) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    let url = `http://localhost:8080/users/updateUser/${user.userId}`;

    this.http.put(url, 0,
      {headers}).subscribe(res => user.banned = 0)

    let emailUrl = "http://localhost:8080/sendMail";
    this.http.post(emailUrl,
      {
        recipient:user.email,
        msgBody:"You got UNBANNED from totally legit stackoverflow",
        subject:"Totally legit stackoverflow UNBAN",
      },
      {headers}).subscribe()
  }
}
