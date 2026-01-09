import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/core/service/task.service';
import { TaskProgressDialogComponent } from './task-progress-dialog/task-progress-dialog.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-employee-task',
  templateUrl: './employee-task.component.html',
  styleUrls: ['./employee-task.component.scss']
})
export class EmployeeTaskComponent implements OnInit {
 tasks: any[] = [];
  loading = false;
  selectedStatus = '';
  filteredTasks: any[] = [];

  constructor(
     private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMyTasks();
  }
loadMyTasks() {
    this.loading = true;
    this.taskService.getEmployeeTasks()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res: any) => {
          this.tasks = res.tasks || [];
          this.applyFilter()
        },
        error: (err) => {
          this.snackBar.open('Failed to load tasks', 'Close', {
            duration: 4000, panelClass: ['error-snackbar']
          });
        }
      });
  }

  openProgressDialog(task: any) {
    const dialogRef = this.dialog.open(TaskProgressDialogComponent, {
      width: '600px',
      data: task
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.loadMyTasks();
    });
  }
  applyFilter() {
  this.filteredTasks = this.selectedStatus
    ? this.tasks.filter(t => t.priority === this.selectedStatus)
    : this.tasks;
}
}
