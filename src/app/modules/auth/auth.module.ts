import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthLayoutComponent } from 'src/app/layouts/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialExampleModule,
    HttpClientModule
  ]
})
export class AuthModule { }
