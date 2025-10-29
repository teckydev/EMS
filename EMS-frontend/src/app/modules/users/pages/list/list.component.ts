import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Leave } from 'src/app/core/model/Leave';
import { LeaveService } from 'src/app/core/service/leave.service';
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
showLeaveForm: boolean = false;  // toggle form
  leaves: any[] = [];
displayedColumns: string[] = ['sno', 'leaveType', 'startDate', 'endDate', 'reason', 'status', 'actions'];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaveService: LeaveService ,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  toggleForm() {
    this.showLeaveForm = !this.showLeaveForm;
  }

  loadLeaves(): void {
    this.leaveService.getUserLeaves().subscribe({
      next: (res: Leave[]) => {
         const formattedLeaves = res.map((leave, index) => ({
          sno: index + 1,
           _id: leave._id,
          leaveType: leave.leaveType,
          startDate: this.formatDate(leave.startDate),
          endDate: this.formatDate(leave.endDate),
          reason: leave.reason,
          status: leave.status
        }));
        this.dataSource = new MatTableDataSource(formattedLeaves);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading leaves:', err)
    });
  }
 // Format date into readable form
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  }
applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onLeaveAdded(event:any) {
    this.showLeaveForm = false; 
    this.loadLeaves() // hide form after submission
  }

  // View leave details
viewLeave(leaveId: string) {
  console.log(leaveId,'leave')
  this.leaveService.getLeaveById(leaveId).subscribe({
    next: (leave) => {
      this.dialog.open(LeaveDetailsComponent, {
        width: '400px',
        data: leave
      });
    },
    error: (err) => console.error(err)
  });
}
// Cancel leave
cancelLeave(leaveId: string) {
  if (!confirm('Are you sure you want to cancel this leave?')) return;

  this.leaveService.cancelLeave(leaveId).subscribe({
    next: () => {
      alert('Leave cancelled successfully');
      this.loadLeaves(); // refresh table
    },
    error: (err) => console.error(err)
  });
}
}
