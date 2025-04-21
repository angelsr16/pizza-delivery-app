import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './pages/products/products.component';
import { StaffComponent } from './pages/staff/staff.component';
import { OrdersComponent } from './pages/orders/orders.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'staff', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'orders', component: OrdersComponent },
    ],
  },
];
