import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExampleModule } from 'src/app/material/material.module';
import { UserLayoutComponent } from 'src/app/layouts/user-layout/user-layout.component';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ProfileSummaryComponent } from './pages/profile-summary/profile-summary.component';
import { LeaveFormComponent } from './pages/leave-form/leave-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './pages/list/list.component';
import { LeaveDetailsComponent } from './pages/leave-details/leave-details.component';
import { EmpSalaryComponent } from './pages/emp-salary/emp-salary.component';
import { ChangePasswordComponent } from './pages/emp-settings/change-password/change-password.component';
import { EditProfileComponent } from './pages/emp-settings/edit-profile/edit-profile.component';
import { EmployeeSettingsComponent } from './pages/emp-settings/employee-settings.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { EmployeeTaskComponent } from './pages/employee-task/employee-task.component';
import { EmpDashboardComponent } from './pages/emp-dashboard/emp-dashboard.component';
import { NotificationStatusComponent } from './pages/emp-dashboard/notification-status/notification-status.component';
import { TaskProgressDialogComponent } from './pages/employee-task/task-progress-dialog/task-progress-dialog.component';


@NgModule({
  declarations: [
    UserLayoutComponent,
    UsersComponent,
    ProfileSummaryComponent,
    LeaveFormComponent,
    ListComponent,
    LeaveDetailsComponent,
    EmpSalaryComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    EmployeeSettingsComponent,
    AttendanceComponent,
    EmployeeTaskComponent,
    EmpDashboardComponent,
    NotificationStatusComponent,
    TaskProgressDialogComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    RouterModule,
    SharedModule,
    MaterialExampleModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UsersModule { }
