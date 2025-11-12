import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeSettingsRoutingModule } from './employee-settings-routing.module';
import { EmployeeSettingsComponent } from '../employee-settings.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    EmployeeSettingsComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    EmployeeSettingsRoutingModule
  ]
})
export class EmployeeSettingsModule { }
