import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AttendanceService } from 'src/app/core/service/attendance.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent implements OnInit {
 detailData: any;
  loading = true;

  constructor(
    private attendanceService: AttendanceService,
    private dialogRef: MatDialogRef<AttendanceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string }
  ) {}

  ngOnInit(): void {
    console.log('Record ID:', this.data);
    this.loadAttendanceDetail();
  }

 loadAttendanceDetail() {
    this.attendanceService.getEmployeeAttendance(this.data.employeeId).subscribe({
      next: (res) => {
        console.log('Attendance Detail:', res);
        this.detailData = res;
        console.log('Detail Data Set:', this.detailData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading detail:', err);
        this.loading = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  

}
