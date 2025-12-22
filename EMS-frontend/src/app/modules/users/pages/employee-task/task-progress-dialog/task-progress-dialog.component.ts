import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from 'src/app/core/service/task.service';

@Component({
  selector: 'app-task-progress-dialog',
  templateUrl: './task-progress-dialog.component.html',
  styleUrls: ['./task-progress-dialog.component.scss']
})
export class TaskProgressDialogComponent implements OnInit {
 saving = false;

  form = this.fb.group({
    progress: [this.data.progress || 0, [Validators.required]],
    status: [this.data.status || 'Pending', Validators.required],
    comment: ['']
  });

  constructor( private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskProgressDialogComponent>,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data);
  }
updateProgress() {
    if (this.form.invalid) return;

    this.saving = true;
    const payload = this.form.value;

    this.taskService.updateTaskProgress(this.data._id, payload).subscribe({
      
      next: () => {
        this.snackBar.open('Task progress updated!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open('Update failed', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
