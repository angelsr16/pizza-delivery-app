import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './pages/products/products.component';
import { StaffComponent } from './pages/staff/staff.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { roleGuard } from '../../core/guards/role-guard.guard';
import { ROLES } from '../../core/constants/roles';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [roleGuard],
        data: {
          expectedRoles: [ROLES.PRODUCTS],
        },
      },
      {
        path: 'staff',
        component: StaffComponent,
        canActivate: [roleGuard],
        data: {
          expectedRoles: [ROLES.SUPER_USER],
        },
      },
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [roleGuard],
        data: {
          expectedRoles: [ROLES.ORDERS],
        },
      },
    ],
  },
];
