import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleAuthService } from '../service/role-auth.service';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     const expectedRole = route.data['role'];
    const userRole = this.authService.getUserRole();

    if (userRole === expectedRole) {
      return true;
    }

    // Redirect based on user role
    if (userRole === 'admin') {
      return this.router.createUrlTree(['/admin/dashboard']);
    } else if (userRole === 'user') {
      return this.router.createUrlTree(['/user/dashboard']);
    }

    return this.router.createUrlTree(['/login']); // fallback
  }
  
}
