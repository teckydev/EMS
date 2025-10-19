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
     console.log(expectedRole,'role')
    const userRole = this.authService.getUserRole();
    console.log('Expected Role:', expectedRole);
console.log('User Role:', userRole);


    // if (userRole === expectedRole) {
    //   return true;
    // }

    // Redirect based on user role
    // if (userRole === 'admin') {
    //   return this.router.createUrlTree(['/admin/dashboard']);
    // } else if (userRole === 'user') {
    //   return this.router.createUrlTree(['/user']);
    // }
if (userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // or redirect to login/admin
      return false;
    }
    // return this.router.createUrlTree(['/login']); // fallback
  }
  
}
