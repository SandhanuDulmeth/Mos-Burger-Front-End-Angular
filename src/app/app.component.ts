import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './common/nav-bar/nav-bar.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavBarComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Mos-Burger-Front-End-Angular';
}
