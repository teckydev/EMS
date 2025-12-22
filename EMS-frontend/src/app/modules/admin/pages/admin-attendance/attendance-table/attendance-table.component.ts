import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-attendance-table',
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.scss']
})
export class AttendanceTableComponent implements OnInit {
@Input() attendanceData: any[] = [];
  @Output() viewDetail = new EventEmitter<any>();
  @Output() markUp = new EventEmitter<any>();

  displayedColumns: string[] = ['empId', 'name', 'department', 'date', 'status', 'actions'];

  /** Emit selected row for detail view */
  onViewDetail(row: any) {
    this.viewDetail.emit(row);
  }

  /** Emit selected row for mark-up (edit attendance) */
  onMarkUp(row: any) {
    this.markUp.emit(row);
  }
  constructor() { }

  ngOnInit(): void {
  }

}
