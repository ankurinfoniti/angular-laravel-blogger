import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(childRoute, state);
  }

  checkLogin(url: string) {
    if (this.authService.isLoggedIn() && this.authService.getRole() === 2) {
      return true;
    }

    if (this.authService.isLoggedIn() && this.authService.getRole() != 2) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    this.authService.redirectUrl = url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return false;
  }
}
