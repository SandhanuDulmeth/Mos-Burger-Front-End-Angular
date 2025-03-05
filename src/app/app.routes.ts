import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemsComponent } from './pages/items/items.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [{
    path: 'home',
    component: HomeComponent

},
{
    path: 'items',
    component: ItemsComponent

},
{
    path:'customer',
    component:CustomerComponent
},
{
    path:'login',
    component:LoginComponent
}


];
