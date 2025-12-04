import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from 'src/app/core/service/attendance.service';

@Component({
  selector: 'app-markup-modal',
  templateUrl: './markup-modal.component.html',
  styleUrls: ['./markup-modal.component.scss']
})
export class MarkupModalComponent implements OnInit {
selectedDate: Date | null = null;
  loading = false;
  message = '';
  constructor( private dialogRef: MatDialogRef<MarkupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
 markAbsent() {
    if (!this.selectedDate) return;

    this.loading = true;
    const date = this.selectedDate.toISOString();

    this.attendanceService.markAbsent(this.data.employeeId, date).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = '✅ Marked as Absent successfully';
        this.snackBar.open(this.message, 'Close', { duration: 3000 });
        setTimeout(() => this.dialogRef.close('refresh'), 1000);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error marking absent:', err);
        this.snackBar.open(
          err?.error?.message || 'Failed to mark absent',
          'Close',
          { duration: 3000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
