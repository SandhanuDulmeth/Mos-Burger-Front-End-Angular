// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemsComponent } from './pages/items/items.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { LoginComponent } from './pages/login/login.component';
import { NavBarComponent } from './common/nav-bar/nav-bar.component';
import { LayoutComponent } from './layout/layout.component'; // Create this component

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent, // Layout component for NavBar + Content
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'customer', component: CustomerComponent },
    ],
  },
];