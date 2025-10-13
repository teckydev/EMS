import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/core/service/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {
   message: string = '';
    isEditMode = false;
 departmentForm = this.fb.group({
  name: ['', Validators.required],
  description: ['', Validators.required],
});
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDepartmentComponent>,private departmentService:DepartmentService, @Inject(MAT_DIALOG_DATA) public data: any) { }



 ngOnInit(): void {
     if (this.data) {
      this.isEditMode = true;
      this.departmentForm.patchValue(this.data);
    }
  }
  
 
  onSubmit() {
    if (this.departmentForm.valid) {
      if (this.isEditMode) {
        // ✅ Update existing department
        this.departmentService.updateDepartment(this.data.id, this.departmentForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: err => console.error(err)
        });
      } else {
        // ✅ Add new department
        this.departmentService.addDepartment(this.departmentForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: err => console.error(err)
        });
      }
    }
  }
close() {
    this.dialogRef.close();
  }
}
