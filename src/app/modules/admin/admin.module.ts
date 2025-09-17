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


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminLayoutComponent,
    DepartmentListComponent,
    AddDepartmentComponent,
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
