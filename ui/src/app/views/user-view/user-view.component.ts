import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user";
import {DatePipe} from "@angular/common";
import {UserService} from "../../services/user.service";

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

    userId: string = "";
    userName: string = "";
    joinDate: string = "";
    token: string | null = "";
    currentUser: User | undefined;
    id: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        const currentDate: Date = new Date();
        this.joinDate = currentDate.toISOString().replace(/\.\d{3}Z$/, '');

        this.id = this.route.snapshot.paramMap.get('userId')
        if (this.id == null) {
            throw new Error("Invalid user id");
        }

        this.userService.getUserByIdWithScore(+this.id).subscribe( response => {
            this.currentUser = response
            this.currentUser.joinDate = <string>this.datePipe.transform(this.currentUser.joinDate, 'medium');
        });
    }
}
