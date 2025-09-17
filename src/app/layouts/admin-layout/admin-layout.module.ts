import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
     AdminLayoutComponent,
  ],
  imports: [
    CommonModule,
SharedModule,

  RouterModule
  ]
})
export class AdminLayoutModule { }
