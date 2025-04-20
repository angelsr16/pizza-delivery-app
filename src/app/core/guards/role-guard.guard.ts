import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../services/users.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const usersService = inject(UsersService);
  const authFirebase = inject(Auth);

  const currentUser = await firstValueFrom(authState(authFirebase));

  if (currentUser !== null) {
    const expectedRoles = route.data['expectedRoles'];
    const userRoles = await usersService.getUserRoles(currentUser.uid);

    const hasPermission = userRoles.some((role) =>
      expectedRoles.includes(role)
    );

    return hasPermission;
  }

  return false;
};
