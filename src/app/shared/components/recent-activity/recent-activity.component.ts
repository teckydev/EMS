import { Component, OnInit } from '@angular/core';
export interface Activity {
  employee: string;
  action: string;
  date: string;
  status: string;
}
@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss']
})
export class RecentActivityComponent implements OnInit {
displayedColumns: string[] = ['employee', 'action', 'date', 'status'];
  dataSource: Activity[] = [
    { employee: 'John Doe', action: 'Applied Leave', date: '2025-09-07', status: 'Approved' },
    { employee: 'Jane Smith', action: 'Joined', date: '2025-09-05', status: 'Active' },
    { employee: 'Mark Wilson', action: 'Resigned', date: '2025-08-30', status: 'Inactive' },
    { employee: 'Lucy Brown', action: 'Promoted', date: '2025-09-01', status: 'Active' },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
