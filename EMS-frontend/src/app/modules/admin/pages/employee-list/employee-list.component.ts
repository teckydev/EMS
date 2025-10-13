import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/core/service/department.service';
import { EmployeeService } from 'src/app/core/service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employeeForm: FormGroup;
  photoPreview: string | ArrayBuffer | null = null;
  departments: any[] = [];
  roles: string[] = ['Admin', 'Manager', 'Employee', 'HR'];
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeForm = this.fb.group({
        empId: ['', Validators.required], // admin sets this
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      photo: [null],
      department: ['', Validators.required],
      position: ['', Validators.required],
      role: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      hireDate: [null, Validators.required],
      gender: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
      })
    });
  }

  ngOnInit(): void {
    console.log(this.data,'matdialog')
   this.departmentService.getDepartments().subscribe((res: any) => {
  this.departments = res;

  if (this.data) { // if editing
    this.isEdit = true;
    setTimeout(() => {
    this.employeeForm.patchValue({
  ...this.data,
  dateOfBirth: this.data.dateOfBirth ? new Date(this.data.dateOfBirth) : null,
  hireDate: this.data.hireDate ? new Date(this.data.hireDate) : null,
  department: this.data.department?._id,
  address: this.data.address || { street: '', city: '', state: '', zipCode: '' }
});

      if (this.data.photo) {
        this.photoPreview = this.getPhotoUrl(this.data.photo);
      }
    });
  }
});

  }

  get addressForm(): FormGroup {
    return this.employeeForm.get('address') as FormGroup;
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.employeeForm.patchValue({ photo: file });
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

 
onSubmit() {
  if (this.employeeForm.invalid) return;

  const formData = new FormData();
  const value = this.employeeForm.value;

  // 1️⃣ Append all top-level fields except 'address' and 'photo'
  Object.keys(value).forEach(key => {
    if (key !== 'address' && key !== 'photo') {
      // Convert dates to ISO string
      if (key === 'dateOfBirth' || key === 'hireDate') {
        formData.append(key, value[key] ? value[key].toISOString() : '');
      } else {
        // Skip empty password in edit mode
        if (key === 'password' && this.isEdit && !value[key]) return;
        // Append only if value is defined
        if (value[key] !== undefined && value[key] !== null) {
          formData.append(key, value[key]);
        }
      }
    }
  });

  // 2️⃣ Append address as JSON string (even if empty object)
  formData.append('address', JSON.stringify(value.address || {}));

  // 3️⃣ Append photo if File exists
  if (value.photo instanceof File) {
    formData.append('photo', value.photo);
  }

  // 4️⃣ Call API
  if (this.isEdit) {
    this.employeeService.updateEmployee(this.data._id, formData).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Update error:', err)
    });
  } else {
    this.employeeService.addEmployee(formData).subscribe({
      next: () => this.dialogRef.close(true),
      error: err => console.error('Add error:', err)
    });
  }
}

 



  close() {
    this.dialogRef.close();
  }
  // Convert server path to frontend URL

getPhotoUrl(path: string): string {
  // Assuming path stored in DB is 'public/uploads/photo-xxxx.png'
  const fileName = path.split('/').pop(); // get 'photo-xxxx.png'
  return `http://localhost:5000/uploads/${fileName}`;
}

}
