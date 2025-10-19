import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExampleModule } from 'src/app/material/material.module';
import { UserLayoutComponent } from 'src/app/layouts/user-layout/user-layout.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UserLayoutComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    RouterModule,
    SharedModule,
    MaterialExampleModule
  ]
})
export class UsersModule { }
