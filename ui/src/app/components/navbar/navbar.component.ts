import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) { }

  toggleMenu() {
    // Implement toggle logic for menu
  }

  navigateToUserPage() {
    const userId = localStorage.getItem('userId');
    this.router.navigate(['/user',userId]);
  }

  navigateToQuestionsPage() {
    this.router.navigate(['/questions']);
  }
}
