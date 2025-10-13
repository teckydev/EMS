import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { GuardGuard } from './core/guards/guard.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
    
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
     canActivate: [GuardGuard, RoleGuard],
    data: { role: 'admin' },
    children: [
      {
        path: '',
        
        loadChildren: () =>
          import('./modules/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [GuardGuard, RoleGuard],
    data: { role: 'user' },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/users/users.module').then(m => m.UsersModule),
        
      }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // Default
  { path: '**', redirectTo: 'auth/login' } // Wildcard
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
