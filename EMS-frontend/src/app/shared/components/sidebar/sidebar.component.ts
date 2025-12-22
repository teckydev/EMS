import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
   @Input() role: 'admin' | 'employee' = 'employee'; // default employee
  isMobile = false;
  menuItems: any[] = [];
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isLargeScreen = window.innerWidth >= 1024; // Tailwind lg breakpoint
  constructor(private router:Router) { }
setMenu() {
    if (this.role === 'admin') {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
        { label: 'Department', icon: 'category_search', route: '/admin/department' },
        { label: 'Employee', icon: 'people', route: '/admin/employees' },
        { label: 'Salary', icon: 'attach_money', route: '/admin/salary' },
          { label: 'Leave', icon: 'event_note', route: '/admin/leave' },
           { label: 'Setting', icon: 'settings', route: '/admin/settings' },
           { label: 'Attendance', icon: 'calendar_today', route: '/admin/attendance' },
      ];
    } else if (this.role === 'employee') {
      this.menuItems = [
         { label: 'Dashboard', icon: 'dashboard', route: '/user/dashboard' },
        { label: 'Profile', icon: 'person', route: '/user/profile' },

      { label: 'Leave', icon: 'event_note', route: '/user/list' },
      { label: 'Salary', icon: 'attach_money', route: '/user/salary' },
      { label: 'Setting', icon: 'settings', route: '/user/settings' },
        { label: 'Tasks', icon: 'check_circle', route: '/user/tasks' },
        { label: 'Attendance', icon: 'calendar_today', route: '/user/attendance' },
      ];
    }
  }
  ngOnInit(): void {
     this.setMenu();
  }

}
