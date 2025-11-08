import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LeaveService } from 'src/app/core/service/leave.service';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  filteredLeaves: any[] = [];
  selectedStatus: string = 'All';
columns = [
    { key: 'sno', label: 'S.No' },
    { key: 'empId', label: 'Emp ID' },
    { key: 'name', label: 'Name' },
    { key: 'leaveType', label: 'Leave Type' },
    { key: 'department', label: 'Department' },
    { key: 'days', label: 'Days' },
    { key: 'status', label: 'Status' },
  ];
  leaveData: any[] = [];
  loading = true;
  constructor(private leaveService: LeaveService,
    private snackBar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
    this.loadLeaves();
  }
   loadLeaves() {
    this.loading = true;
    this.leaveService.getAllLeaves()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any[]) => {
          this.leaveData = res.map((leave, index) => ({
            sno: index + 1,
            empId: leave.employee?.empId,
            name: leave.employee?.name,
            leaveType: leave.leaveType,
            department: leave.employee?.position,
            days: this.calculateDays(leave.startDate, leave.endDate),
            status: leave.status,
            _id: leave._id
          }));
           this.filteredLeaves = [...this.leaveData];
        },
        error: (err) => {
          this.snackBar.open(`Error loading leaves: ${err.message}`, 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'All') {
      this.filteredLeaves = [...this.leaveData];
    } else {
      this.filteredLeaves = this.leaveData.filter(leave => leave.status === status);
    }
  }
// Called when clicking edit or delete icons from shared table
 onView(leave: any){
 this.router.navigate(['/admin/leaves', leave._id, 'status']);
 }

  
   calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  }
}
