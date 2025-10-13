import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
// parent.component.ts
public departmentChartData: ChartConfiguration<'pie'>['data'] = {
  labels: ['HR','Engineering','Sales','Marketing'],
  datasets: [
    {
      data: [12,35,18,10],
      backgroundColor: ['#4f46e5','#22c55e','#f97316','#eab308']
    }
  ]
};

public genderRoleChartData: ChartConfiguration<'bar'>['data'] = {
  labels: ['Admin','Manager','Developer','Designer','HR'],
  datasets: [
    { data: [5,2,20,3,4], label: 'Male', backgroundColor: '#3b82f6' },
    { data: [2,1,10,5,3], label: 'Female', backgroundColor: '#f472b6' }
  ]
};

  constructor() { }

  ngOnInit(): void {
  }

}
