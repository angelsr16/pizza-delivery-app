import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { authState } from 'rxfire/auth';
import { filter, firstValueFrom, take } from 'rxjs';
import { UsersService } from '../services/users.service';
import { UserDB } from '../models/UserDB';

export const roleGuard: CanActivateFn = async (route, state) => {
  const usersService = inject(UsersService);

  const currentUser = await firstValueFrom(
    usersService.currentUserDB$.pipe(
      filter((user): user is UserDB => user !== null), // Wait until user is not null
      take(1) // Complete after first non-null value
    )
  );

  const expectedRoles = route.data['expectedRoles'] || [];
  const userRoles = currentUser.roles || [];

  const hasPermission = userRoles.some((role) => expectedRoles.includes(role));

  console.log('Has permission?', hasPermission);

  return hasPermission;
};
