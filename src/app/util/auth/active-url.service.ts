import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
class AdminGuard {
  CanActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return true;
  }
}

export const ActiveUrlService: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {    
  return inject(AdminGuard).CanActivate(route, state);
}