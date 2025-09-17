import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isMobile = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isLargeScreen = window.innerWidth >= 1024; // Tailwind lg breakpoint
  constructor(private router:Router) { }
menuItems = [
    { label: 'Dashboard', icon: 'dashboard',  route: '/admin/dashboard' },
    //  { label: 'Employee', icon: 'people' },
     { label: 'Department', icon: 'people' ,route: '/admin/department'},
    // { label: 'Leaves', icon: 'event' },
    // { label: 'Salary', icon: 'attach_money' },
    // { label: 'Settings', icon: 'settings' },
  ];
  ngOnInit(): void {
  }

}
