import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from 'src/app/layouts/admin-layout/admin-layout.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { AddDepartmentComponent } from './pages/add-department/add-department.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { AddSalaryComponent } from './pages/salary/add-salary/add-salary.component';
import { ViewSalaryComponent } from './pages/salary/view-salary/view-salary.component';
import { LeaveListComponent } from './pages/admin-leave/leave-list/leave-list.component';
import { LeaveDetailComponent } from './pages/admin-leave/leave-detail/leave-detail.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'department', component: DepartmentListComponent },
  { path: 'add-dept', component: AddDepartmentComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'salary', component: AddSalaryComponent },
   {
    path: 'salary/:salaryId',
    component: AddSalaryComponent,
  },
  { path: 'view-salary/:employeeId', component: ViewSalaryComponent },
 
{ path: 'leave', component: LeaveListComponent },
{ path: 'leaves/:id/status', component: LeaveDetailComponent }
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
