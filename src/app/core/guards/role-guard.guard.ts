import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { filter, firstValueFrom, take } from 'rxjs';
import { UsersService } from '../services/users.service';
import { UserDB } from '../models/UserDB';
import { ROLES } from '../constants/roles';

export const roleGuard: CanActivateFn = async (route, state) => {
  const usersService = inject(UsersService);

  const currentUser = await firstValueFrom(
    usersService.currentUserDB$.pipe(
      filter((user): user is UserDB => user !== null),
      take(1)
    )
  );

  const expectedRoles = route.data['expectedRoles'] || [];
  const userRoles = currentUser.roles || [];

  const isSuperUser = userRoles.includes(ROLES.SUPER_USER);

  if (isSuperUser) {
    return true;
  }

  const hasPermission = userRoles.some((role) => expectedRoles.includes(role));

  return hasPermission;
};
