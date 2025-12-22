import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AttendanceService } from 'src/app/core/service/attendance.service';
import { AttendanceDetailComponent } from '../attendance-detail/attendance-detail.component';
import { MarkupModalComponent } from '../markup-modal/markup-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.scss']
})
export class AdminAttendanceComponent implements OnInit {
  departments: string[] = [];
  attendanceData: any[] = [];
  filteredData: any[] = [];
  selectedDepartment = '';
  selectedStatus = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  loading = false;

  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  /** 🔹 Load attendance for all employees (Admin view) */
  loadAttendance() {
    this.loading = true;
    this.attendanceService
      .getAllAttendance()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.attendanceData = res.records.map((r: any) => ({
            empId: r.employee?.empId,
            name: `${r.employee?.firstName} ${r.employee?.lastName}`,
            department: r.employee?.position,
            date: r.date,
            status: r.status,
            _id: r._id,
             employee: r.employee,      
            sessions: r.sessions || [],
            totalHours: r.totalHours || 0
          }));

          this.filteredData = [...this.attendanceData];

          this.departments = Array.from(
            new Set(this.attendanceData.map(r => r.department).filter(Boolean))
          );
        },
        error: (err) => {
          console.error('❌ Error loading attendance:', err);
          this.snackBar.open(`Failed to load attendance: ${err.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /** 🔹 Combine all filters */
  applyFilters() {
    this.filteredData = this.attendanceData.filter(record => {
      const matchesDept = this.selectedDepartment ? record.department === this.selectedDepartment : true;
      const matchesStatus = this.selectedStatus ? record.status === this.selectedStatus : true;
      const recordDate = new Date(record.date);

      const matchesDate =
        this.fromDate && this.toDate
          ? recordDate >= this.fromDate && recordDate <= this.toDate
          : true;

      return matchesDept && matchesStatus && matchesDate;
    });
  }

  /** 🔹 Open detail modal */
  
   openDetailModal(record: any) {
    console.log('Selected Record:', record);
  const employeeId = record.employee?._id; // 👈 employee id, not record._id
    console.log('Opening detail modal for Employee ID:', employeeId);
    const dialogRef = this.dialog.open(AttendanceDetailComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { employeeId },
      autoFocus: false,
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.loadAttendance();
      }
    });
  }
/** Handle View Detail click from child */
  onViewDetail(row: any) {
    this.router.navigate(['/attendance', row.employeeId]);
  }
  /** 🔹 Open mark-up modal */
  openMarkUpModal(record: any) {
      const employeeId = record.employee?._id ; //
  const dialogRef = this.dialog.open(MarkupModalComponent, {
    width: '400px',
  data: { ...record, employeeId } // ✅ include employeeId explicitly
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'refresh') {
      this.loadAttendance(); // reload table after marking absent
    }
  });
}


  /** 🔹 Export CSV */
  exportCSV() {
    if (!this.filteredData.length) {
      this.snackBar.open('No data available for export', 'Close', { duration: 3000 });
      return;
    }

    const headers = ['Emp ID', 'Name', 'Department', 'Date', 'Status'];
    const rows = this.filteredData.map(r =>
      [r.empId, r.name, r.department, new Date(r.date).toLocaleDateString(), r.status]
    );

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance-report.csv';
    link.click();
  }

  /** 🔹 Export PDF */
  exportPDF() {
    console.log('Export PDF clicked');
    // Future enhancement using jsPDF or pdfmake
  }
}
