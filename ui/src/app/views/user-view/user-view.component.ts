import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {Answer} from "../../models/answer";


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [NavbarComponent, MatCardModule, MatButtonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
  providers: [
    DatePipe
  ],
})
export class UserViewComponent implements OnInit {

  userId: string | null = null;
  userName: string | null = null;
  id: number | null = null;
  joinDate: string | null = null;
  token: string | null = null;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      console.log(id);

      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const url =  `http://localhost:8080/users/getById/${id}`;
      this.http.get<User>(url, {headers})
        .subscribe(res => {
          this.currentUser = res as User;
          this.currentUser.joinDate = <string>this.datePipe.transform(this.currentUser.joinDate, 'medium');

          const userScoreUrl = `http://localhost:8080/users/getUserScore/${this.currentUser.userId}`
          this.http.get<number>(userScoreUrl, {headers})
            .subscribe(res => {
              if (this.currentUser) {
                this.currentUser.score = res;
              }
            })
        });

    });

  }
}
