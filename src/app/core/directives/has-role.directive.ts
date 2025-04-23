import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UsersService } from '../services/users.service';
import { filter, firstValueFrom, take } from 'rxjs';
import { UserDB } from '../models/UserDB';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') expectedRoles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.checkIfUserHasRole();
  }

  async checkIfUserHasRole() {
    const currentUser = await firstValueFrom(
      this.usersService.currentUserDB$.pipe(
        filter((user): user is UserDB => user !== null),
        take(1)
      )
    );

    const userRoles = currentUser.roles || [];

    const isSuperUser = userRoles.includes('superUser');

    const hasAccess = this.expectedRoles.every((role) =>
      userRoles.includes(role)
    );

    if (hasAccess || isSuperUser) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
