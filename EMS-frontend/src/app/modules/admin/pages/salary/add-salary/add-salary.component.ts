import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from 'src/app/core/service/department.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { SalaryService } from 'src/app/core/service/salary.service';

@Component({
  selector: 'app-add-salary',
  templateUrl: './add-salary.component.html',
  styleUrls: ['./add-salary.component.scss'],
})
export class AddSalaryComponent implements OnInit {
  salaryId?: string; // if exists → edit mode
  employees: any[] = [];
  departments: any[] = [];
  selectedEmployee: any | null = null;
  message: string = '';

  salaryForm = this.fb.group({
    department: ['', Validators.required],
    employee: ['', Validators.required],
    basicSalary: ['', Validators.required],
    allowance: ['', Validators.required],
    deductions: ['', Validators.required],
    payDate: [new Date(), Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private salaryService: SalaryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.salaryId = this.route.snapshot.paramMap.get('salaryId')!;
    console.log(this.salaryId, 'check-editt');
    this.loadDepartments();
    if (this.salaryId) {
      // Edit mode → fetch salary data
      this.salaryService.getSalaryById(this.salaryId).subscribe((res) => {
        this.selectedEmployee = res.employee; // ✅ Needed for update
        console.log(res, 'salary--rr');
        this.salaryForm.patchValue({
          department: res.department._id,
          employee: res.employee._id,
          basicSalary: res.basicSalary,
          allowance: res.allowances,
          deductions: res.deductions,
          payDate: new Date(res.payDate),
        });
      });
    }
  }

  // Load all departments
  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        console.log('Loaded departments:', this.departments);
      },
      error: (err) => console.error('Error loading departments:', err),
    });
  }

  // When a department is selected

  onDepartmentChange(deptId: string) {
    console.log('Selected Department ID:', deptId);

    this.employeeService.getEmployeesByDepartment(deptId).subscribe({
      next: (res) => {
        console.log('Employees received:', res);
        this.employees = res.employees;
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }

  // When employee is selected
  onEmployeeChange(empId: string) {
    if (!empId) return;

    this.employeeService.getEmployeeById(empId).subscribe({
      next: (emp) => {
        this.selectedEmployee = emp;
        console.log(this.selectedEmployee, 'emmmmm');
      },
      error: (err) => console.error('Error fetching employee:', err),
    });
  }

  onSubmit() {
    console.log('update');
    if (!this.salaryForm.valid || !this.selectedEmployee) return;

    const payload = {
      employeeId: this.selectedEmployee._id,
      department: this.salaryForm.value.department,
      basicSalary: this.salaryForm.value.basicSalary,
      allowances: this.salaryForm.value.allowance,
      deductions: this.salaryForm.value.deductions,
      // Convert date to string for backend
      payDate: this.salaryForm.value.payDate?.toISOString().substring(0, 10),
    };

    if (this.salaryId) {
      console.log(this.salaryId, 'check-edit');
      // Edit salary
      this.salaryService.updateSalary(this.salaryId, payload).subscribe({
        next: () => {
          this.message = 'Salary updated successfully!';
          this.router.navigate([
            'admin/view-salary',
            this.selectedEmployee._id,
          ]); // redirect after edit
        },
        error: (err) => console.error(err),
      });
    } else {
      // Add salary
      this.salaryService.addSalary(payload).subscribe({
        next: () => {
          this.message = 'Salary added successfully!';
          this.salaryForm.reset();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
