import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService } from 'src/app/core/service/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
 isCheckedIn = false;
  myAttendance: any[] = [];
 displayedColumns: string[] = ['date', 'sessions', 'totalHours', 'status'];
 dataSource = new MatTableDataSource<any>([]);
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 loading = true;
 attendanceData: any[] = [];
  constructor(
    private attendanceService: AttendanceService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAttendance();
  }
 ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  checkIn() {
     this.isCheckedIn = true;
    this.attendanceService.checkIn().subscribe({
      next: (res) => {
        this.snack.open('Checked In Successfully', 'Close', { duration: 2000 });
        this.loadAttendance();
      }
    });
  }

  checkOut() {
     this.isCheckedIn = false;
    this.attendanceService.checkOut().subscribe({
      next: (res) => {
        this.snack.open('Checked Out Successfully', 'Close', { duration: 2000 });
        this.loadAttendance();
      }
    });
  }

  loadAttendance() {
    this.attendanceService.getMyAttendance().subscribe({
      next: (res) => {
        this.attendanceData = res.records;
        this.loading = false;}
    });
  }
  // ✅ Format date and time for UI
  // Convert hours (e.g., 0.0162) → "0 h 58 m"
  formatHours(hours: number): string {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  }
}
