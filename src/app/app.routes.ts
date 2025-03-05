import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemsComponent } from './pages/items/items.component';

export const routes: Routes = [{
    path: 'home',
    component: HomeComponent

},
{
    path: 'items',
    component: ItemsComponent

}


];
