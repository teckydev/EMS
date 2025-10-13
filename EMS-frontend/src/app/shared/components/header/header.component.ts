import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 @Output() toggleSidenavEvent = new EventEmitter<void>();

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }
  constructor() { }

  ngOnInit(): void {
  }

}
