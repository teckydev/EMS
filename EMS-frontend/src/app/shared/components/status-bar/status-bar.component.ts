import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {
 @Input() isCheckedIn = false;
  @Input() workedTime = '0h 0m';
  @Input() pendingTasks = 0;
  @Input() alerts = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
