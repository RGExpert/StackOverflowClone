import { Component } from '@angular/core';
import {NavbarComponent} from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css'
})
export class HomeViewComponent {

}
