import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from 'src/app/core/service/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
   statsCards: any[] = [];
   departmentChartData: any;
genderRoleChartData: any;
recentActivity: any[] = [];


  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadRecentActivity();
  }
 
// parent.component.ts
 loadDashboardStats() {
  this.dashboardService.getAdminStats().subscribe({
    next: (data) => {

      // ---------- KPI Cards ----------
      this.statsCards = [
        { title: 'Total Employees', value: data.totalEmployees, icon: 'groups', color: 'bg-indigo-600' },
        { title: 'Active Employees', value: data.activeEmployees, icon: 'verified', color: 'bg-green-600' },
        { title: 'On Leave Today', value: data.onLeaveToday, icon: 'event_busy', color: 'bg-yellow-600' },
        { title: 'Departments', value: data.employeesByDepartment.length, icon: 'apartment', color: 'bg-purple-600' },
        { title: 'New Hires', value: data.newHires, icon: 'person_add', color: 'bg-blue-600' },
        { title: 'Attrition Rate', value: `${data.attritionRate}%`, icon: 'trending_down', color: 'bg-red-600' },
      ];

      // ---------- Department Chart (Pie) ----------
      this.departmentChartData = {
        labels: data.employeesByDepartment.map((d: any) => d.name),
        datasets: [{
          data: data.employeesByDepartment.map((d: any) => d.count)
        }]
      };

      // ---------- Gender / Role Chart (Bar) ----------
      this.genderRoleChartData = {
        labels: ['Male', 'Female', 'Admin', 'Manager', 'Employee'],
        datasets: [
          {
            label: 'Gender',
            data: [
              data.genderStats.find((g: any) => g._id === 'Male')?.count || 0,
              data.genderStats.find((g: any) => g._id === 'Female')?.count || 0
            ]
          },
          {
            label: 'Roles',
            data: [
              data.roleStats.find((r: any) => r._id === 'admin')?.count || 0,
              data.roleStats.find((r: any) => r._id === 'manager')?.count || 0,
              data.roleStats.find((r: any) => r._id === 'employee')?.count || 0
            ]
          }
        ]
      };

    },
    error: (err) => {
      console.error('Failed to load dashboard stats', err);
    }
  });
}
loadRecentActivity() {
    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => {
        this.recentActivity = data; 
        console.log(this.recentActivity, 'recent activity');  // <=== SET CHILD DATA
      },
      error: (err) => console.error(err)
    });
  }


 
}
