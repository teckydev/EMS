import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminLayoutComponent } from 'src/app/layouts/admin-layout/admin-layout.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { AddDepartmentComponent } from './pages/add-department/add-department.component';
import { MaterialExampleModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeViewComponent } from './pages/employee-view/employee-view.component';
import { AddSalaryComponent } from './pages/salary/add-salary/add-salary.component';
import { ViewSalaryComponent } from './pages/salary/view-salary/view-salary.component';
import { LeaveListComponent } from './pages/admin-leave/leave-list/leave-list.component';
import { LeaveDetailComponent } from './pages/admin-leave/leave-detail/leave-detail.component';
import { DatedifPipe } from 'src/app/core/pipes/datedif.pipe';
import { ProfileSettingComponent } from './pages/settings/profile-setting/profile-setting.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { OrganizationSettingComponent } from './pages/settings/organization-setting/organization-setting.component';
import { LeaveSettingComponent } from './pages/settings/leave-setting/leave-setting.component';
import { SystemSettingComponent } from './pages/settings/system-setting/system-setting.component';
import { AttendanceSettingComponent } from './pages/settings/attendance-setting/attendance-setting.component';
import { AdminAttendanceComponent } from './pages/admin-attendance/admin-attendance/admin-attendance.component';
import { AttendanceTableComponent } from './pages/admin-attendance/attendance-table/attendance-table.component';
import { AttendanceDetailComponent } from './pages/admin-attendance/attendance-detail/attendance-detail.component';
import { MarkupModalComponent } from './pages/admin-attendance/markup-modal/markup-modal.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLayoutComponent,
    DepartmentListComponent,
    AddDepartmentComponent,
    EmployeeComponent,
    EmployeeListComponent,
    EmployeeViewComponent,
    AddSalaryComponent,
    ViewSalaryComponent,
    LeaveListComponent,
    LeaveDetailComponent,
    DatedifPipe,
    ProfileSettingComponent,
    SettingsComponent,
    OrganizationSettingComponent,
    LeaveSettingComponent,
    SystemSettingComponent,
    AttendanceSettingComponent,
    AdminAttendanceComponent,
    AttendanceTableComponent,
    AttendanceDetailComponent,
    MarkupModalComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    SharedModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
