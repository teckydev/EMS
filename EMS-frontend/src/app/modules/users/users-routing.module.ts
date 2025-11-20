import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileSummaryComponent } from './pages/profile-summary/profile-summary.component';
import { UsersComponent } from './users.component';
import { LeaveFormComponent } from './pages/leave-form/leave-form.component';
import { ListComponent } from './pages/list/list.component';
import { LeaveDetailsComponent } from './pages/leave-details/leave-details.component';
import { EmpSalaryComponent } from './pages/emp-salary/emp-salary.component';
import { EmployeeSettingsComponent } from './pages/emp-settings/employee-settings.component';
import { EditProfileComponent } from './pages/emp-settings/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path:'',component:UsersComponent
  },
  {
    path:'profile',component:ProfileSummaryComponent
  },
  {
    path:'list',component:ListComponent
  },
  {
    path:'leave',component:LeaveFormComponent
  },
  {
    path:'detail/:id',component:LeaveDetailsComponent
  },{
    path:'salary',component:EmpSalaryComponent
  },
  {
    path:'settings',component:EmployeeSettingsComponent
  },
  {
    path:"edit-profil",component:EditProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
