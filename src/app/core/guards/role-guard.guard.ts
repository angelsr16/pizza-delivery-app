import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../services/users.service';
import { UserDB } from '../models/UserDB';

export const roleGuard: CanActivateFn = async (route, state) => {
  console.log("Role guard fired")


  const usersService = inject(UsersService);

  const currentUser: UserDB | null = await firstValueFrom(
    usersService.currentUserDB$
  );

  if (currentUser) {
    const expectedRoles = route.data['expectedRoles'];

    const userRoles = currentUser?.roles || [];

    const hasPermission = userRoles.some((role) =>
      expectedRoles.includes(role)
    );

    console.log(hasPermission);

    return hasPermission;
  }

  console.log('There is no user logged in');
  return false;
};
