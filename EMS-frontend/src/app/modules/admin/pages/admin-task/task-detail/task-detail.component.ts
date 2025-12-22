import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TaskDetailComponent>,
    private dialog: MatDialog) { }

  ngOnInit(): void {
  }
onEdit() {
    // Open Edit Task dialog with current data
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '600px',
      data: { task: this.data } // pass full task object
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.dialogRef.close(true); // refresh parent if edited
    });
  }
}
