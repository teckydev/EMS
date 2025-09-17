import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from 'src/app/layouts/admin-layout/admin-layout.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { AddDepartmentComponent } from './pages/add-department/add-department.component';

const routes: Routes = [
   
       { path: 'dashboard', component: AdminDashboardComponent },
        { path: 'department', component:DepartmentListComponent },
      { path: 'add-dept', component: AddDepartmentComponent },
      // { path: 'employees', component: EmployeesComponent },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
