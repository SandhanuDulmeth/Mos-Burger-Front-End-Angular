// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ItemsComponent } from './pages/items/items.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layout/layout.component'; 
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { authGuard } from './auth.guard'; 
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: LayoutComponent, 
        canActivateChild: [authGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'items', component: ItemsComponent },
            { path: 'customer', component: CustomerComponent },
            { path: 'order-history', component: OrderHistoryComponent },
            { path: 'operations',component:OperationsComponent},
            { path: 'reports', component:ReportsComponent}
        ],
    },
];