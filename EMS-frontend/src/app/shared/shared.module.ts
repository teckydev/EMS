import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaterialExampleModule } from '../material/material.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { KpicardComponent } from './components/kpicard/kpicard.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { RecentActivityComponent } from './components/recent-activity/recent-activity.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    KpicardComponent,
    ChartComponent,
    RecentActivityComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    MaterialExampleModule,
    RouterModule,
    NgChartsModule,
    FormsModule
  ],
  exports: [
    SidebarComponent,
    HeaderComponent,
    KpicardComponent,
    ChartComponent,
    RecentActivityComponent,
    DataTableComponent,
    CommonModule
  ]
})
export class SharedModule { }
