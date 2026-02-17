import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/core/service/sidenav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() role: 'admin' | 'employee' = 'employee';

  @ViewChild('drawer') drawer!: MatSidenav;

  isMobile = false;
  menuItems: any[] = [];

  userMenuOpen = false;
  notifications = [
    { title: 'Leave', message: 'Leave approved' },
    { title: 'Task', message: 'New task assigned' },
  ];

  constructor(private sidenavService: SidenavService, private router: Router) {}

  ngOnInit(): void {
    this.checkScreen();
    this.setMenu();

    // Auto-close sidenav on route change (mobile only)
    this.router.events.subscribe(() => {
      if (this.isMobile && this.drawer) {
        this.drawer.close();
      }
    });
  }

   ngAfterViewInit() {
    this.sidenavService.register(this.drawer);
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.userMenuOpen = false;
  }

  logout() {
    console.log('Logged out');
    this.userMenuOpen = false;
  }

  setMenu() {
    if (this.role === 'admin') {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
        { label: 'Department', icon: 'category', route: '/admin/department' },
        { label: 'Employee', icon: 'people', route: '/admin/employees' },
        { label: 'Salary', icon: 'attach_money', route: '/admin/salary' },
        { label: 'Leave', icon: 'event_note', route: '/admin/leave' },
        { label: 'Attendance', icon: 'calendar_today', route: '/admin/attendance' },
        { label: 'Tasks', icon: 'check_circle', route: '/admin/tasks' },
        { label: 'Settings', icon: 'settings', route: '/admin/settings' },
      ];
    } else {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/user/dashboard' },
        { label: 'Profile', icon: 'person', route: '/user/profile' },
        { label: 'Leave', icon: 'event_note', route: '/user/list' },
        { label: 'Salary', icon: 'attach_money', route: '/user/salary' },
        { label: 'Attendance', icon: 'calendar_today', route: '/user/attendance' },
        { label: 'Tasks', icon: 'check_circle', route: '/user/tasks' },
        { label: 'Settings', icon: 'settings', route: '/user/settings' },
      ];
    }
  }
}
