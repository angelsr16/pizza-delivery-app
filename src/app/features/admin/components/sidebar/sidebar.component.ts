import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CustomMenuItem } from '../../../../core/models/CustomMenuItem';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HasRoleDirective } from '../../../../core/directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  isExpanded = true;

  menuItems: CustomMenuItem[] = [
    {
      title: 'Staff',
      icon: 'pi-users',
      path: 'staff',
      expectedRoles: ['internalUser', 'admin'],
    },
    {
      title: 'Products',
      icon: 'pi-objects-column',
      path: 'products',
      expectedRoles: ['internalUser', 'products'],
    },
    {
      title: 'Orders',
      icon: 'pi-list',
      path: 'orders',
      expectedRoles: ['internalUser', 'orders'],
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async handleSignOut() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const windowWidth = window.innerWidth;
    this.isExpanded = windowWidth > 768;
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
