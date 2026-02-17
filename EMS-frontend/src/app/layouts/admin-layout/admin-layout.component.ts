import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isMobile = false;
  constructor() { }

  ngOnInit(): void {
    this.checkScreen();
  }
 @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
}
