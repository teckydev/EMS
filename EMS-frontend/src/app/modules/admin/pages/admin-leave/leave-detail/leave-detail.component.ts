import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveService } from 'src/app/core/service/leave.service';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.scss']
})
export class LeaveDetailComponent implements OnInit {
 leaveId!: string;
  leave: any;
  loading = true;
  constructor(private route: ActivatedRoute,
    private leaveService: LeaveService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.leaveId = this.route.snapshot.paramMap.get('id')!;
    this.fetchLeaveDetails();
  }
 fetchLeaveDetails() {
    this.leaveService.getLeaveById(this.leaveId).subscribe({
      next: (res) => {
        this.leave = res;
        console.log(this.leave,'ccccccc')
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load leave:', err);
      }
    });
  }
  updateStatus(status: string) {
    this.leaveService.updateLeaveStatus(this.leaveId, status).subscribe({
      next: (res) => {
        this.snackBar.open(`Leave ${status} successfully`, 'Close', { duration: 3000 });
        this.router.navigate(['/admin/leave']);
      },
      error: (err) => {
        console.error('Status update failed:', err);
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }
}
