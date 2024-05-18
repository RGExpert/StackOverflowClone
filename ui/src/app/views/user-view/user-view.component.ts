import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import mockData from "../../mockdata/mock-data";


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [NavbarComponent,MatCardModule, MatButtonModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit{

  userId: string | null = null;
  userName: string | null = null;
  id: number | null = null;
  joinDate: string | null = null;

  currentUser : User | null = null;
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');

    });

    if (this.userId != null) {
      const userIdNumber = parseInt(this.userId, 10);
      this.currentUser = <User>mockData.users.find(u => u.id ==userIdNumber);
    }

  }
}
