import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { NotificationService } from 'src/app/core/service/notification.service';
import { SidenavService } from 'src/app/core/service/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notifications: any[] = [];
  userMenuOpen = false;

  @Output() toggleSidenavEvent = new EventEmitter<void>();

  toggleSidenav() {
     console.log('Toggling sidenav');
    // this.toggleSidenavEvent.emit();
    this.sidenavService.toggle();
  }

  

  constructor(
    private router: Router,
    private authservice: AuthService,
    private notifService: NotificationService,
    private sidenavService: SidenavService
  ) {}
   toggleSidebar() {
     console.log('Toggling user menu');
  }

  toggleUserMenu() {
   
    this.userMenuOpen = !this.userMenuOpen;
  }
  logout() {
    // Call your AuthService logout method
    console.log('Logging out...');
    // Navigate to login page
    this.authservice.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {
    this.notifService.notifications$.subscribe((n) => (this.notifications = n));
  }
  navigateToProfile() {}
}
