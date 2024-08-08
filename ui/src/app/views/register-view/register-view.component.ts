import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {RegisterService} from "../../services/register.service";

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
    username: string = "";
    password: string = "";
    confirmPassword: string = "";
    email: string = "";

    constructor(
        private router: Router,
        private registerService: RegisterService,
    ) { }

    user: User | undefined;
    register(): void {
        this.user =  <User>{
            userName: this.username,
            password: this.password,
            joinDate: "",
            email: this.email,
            role: {
                roleId: 1,
                roleName: "USER"
            }
        }

        this.registerService.register(this.user)
            .subscribe( response =>{
                if(response){
                    this.router.navigate(['/login']);
                } else {
                    console.log("User creation error");
                }
            });
    }
}
