import {Component, inject, input} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {LoginService} from "../../services/login.service";

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
    hide: boolean = true;
    username: string = '';
    password: string = '';

    banned: Boolean | undefined;
    constructor(
        private router: Router,
        private loginService: LoginService
    ) { }

    login(){
        this.loginService.login(this.username, this.password)
            .subscribe(response =>{
                if(response){
                    localStorage.setItem(
                        'token',
                        response.accessToken,
                    );

                    this.banned = response.banned
                    if(!response.banned) {
                        this.router.navigate(['/home']);
                    }
                } else {
                    console.log("Authentication failed");
                }
            })
    }

    redirectToRegister() {
        this.router.navigate(['/register'])
    }
}
