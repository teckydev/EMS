import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/core/service/task.service';
import { TaskFormDialogComponent } from './task-form-dialog/task-form-dialog.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

@Component({
  selector: 'app-admin-task',
  templateUrl: './admin-task.component.html',
  styleUrls: ['./admin-task.component.scss']
})
export class AdminTaskComponent implements OnInit {
 tasks: any[] = [];
  loading = false;
  selectedStatus = '';
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }


   loadTasks() {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (res) => {
       this.tasks = res.tasks ; 
        console.log(this.tasks,"tasks loaded");
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
      },
    });
  }
  get filteredTasks() {
  return this.tasks.filter(
    t => !this.selectedStatus || t.priority === this.selectedStatus
  );
}
  openAddTask() {
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTasks();
    });
  }

 openEditTask(task: any) {
  const dialogRef = this.dialog.open(TaskFormDialogComponent, {
    width: '700px',
    data: { task} 
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) this.loadTasks();
  });
}
openTaskDetail(task: any) {
  const dialogRef = this.dialog.open(TaskDetailComponent, {
    width: '700px',
    data: task
  });

  dialogRef.afterClosed().subscribe((refresh) => {
    if (refresh) this.loadTasks(); // reload list if edited
  });
}
confirmDelete(task: any) {
  const confirmed = confirm(`Are you sure you want to delete "${task.title}"?`);
  if (!confirmed) return;

  this.taskService.deleteTask(task._id).subscribe({
    next: () => {
      this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
      this.loadTasks(); // Refresh list
    },
    error: (err) => {
      console.error('Error deleting task:', err);
      this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
    }
  });
}

}
