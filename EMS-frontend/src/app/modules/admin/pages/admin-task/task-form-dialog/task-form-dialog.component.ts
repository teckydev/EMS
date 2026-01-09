import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from 'src/app/core/service/department.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { TaskService } from 'src/app/core/service/task.service';

@Component({
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss']
})
export class TaskFormDialogComponent implements OnInit {
 taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    assignedTo: ['', Validators.required],
    department: ['', Validators.required],
    dueDate: ['', Validators.required],
    priority: ['Medium', Validators.required],
    status: ['Pending']
  });
  departments: any[] = [];
  employees: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormDialogComponent>,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
     private empService: EmployeeService,
     private deptService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) { }

  ngOnInit(): void {
    const formattedDate = this.data.task.dueDate
    ? new Date(this.data.task.dueDate).toISOString().split('T')[0]
    : '';
    if (this.data?.task) {
    // Patch values for edit mode
    this.taskForm.patchValue({
      title: this.data.task.title,
      description: this.data.task.description,
      assignedTo: this.data.task.assignedTo?._id,
      department: this.data.task.department?._id,
      dueDate: formattedDate,
      priority: this.data.task.priority,
      status: this.data.task.status
    });
  }
      this.loadDepartments();
this.loadEmployees();
    
  }
   loadDepartments() {
    this.deptService.getDepartments().subscribe({
      next: (res) => (this.departments = res.departments || res),
      error: (err) => console.error('Error loading departments', err)
    });
  }
  loadEmployees() {
    this.empService.getEmployees().subscribe({
      next: (res) => (this.employees = res),
      error: (err) => console.error('Error loading employees', err)
    });
  }
onSubmit() {
    if (this.taskForm.invalid) return;

    // Prepare payload exactly like backend expects
    const taskData = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      assignedTo: this.taskForm.value.assignedTo,
      department: this.taskForm.value.department,
      dueDate: this.taskForm.value.dueDate,
      priority: this.taskForm.value.priority,
    };

    const request = this.data?.task
  ? this.taskService.updateTask(this.data.task._id, taskData)
  : this.taskService.addTask(taskData);


    request.subscribe({
      next: () => {
        this.snackBar.open('Task saved successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error saving task', 'Close', { duration: 3000 });
      }
    });
  }
}
