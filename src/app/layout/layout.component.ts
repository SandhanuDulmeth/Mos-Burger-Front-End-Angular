
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../common/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterModule], // Import RouterModule for <router-outlet>
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {}