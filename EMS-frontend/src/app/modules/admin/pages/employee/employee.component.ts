import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employee } from 'src/app/core/model/Employee';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { EmployeeViewComponent } from '../employee-view/employee-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  columnsSchema = [
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'department',
      label: 'Department',
      render: (element: any) => element.department?.name,
    },
    { key: 'position', label: 'Position' },
      { key: 'salary', label: 'Salary', type: 'button', render: (row:any) => 'View Salary' }
  ];

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

 
loadEmployees() {
  this.employeeService.getEmployees().subscribe((res) => {
  this.employees = res;
  console.log(this.employees,'check api')
  });
}

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '700px',
      maxHeight: '90vh', // limits height to 90% of viewport
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
       this.loadEmployees();
    });
  }

  onEdit(employee: any) {
    console.log("edit")
    const dialogRef = this.dialog.open(EmployeeListComponent, {
      width: '700px',
      maxHeight: '90vh',
      autoFocus: false,
      data: employee,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadEmployees();
    });
  }

  onDelete(employee: any) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService
        .deleteEmployee(employee._id)
        .subscribe(() => this.loadEmployees());
    }
  }
  onView(employee: any) {
  this.dialog.open(EmployeeViewComponent, {
    width: '600px',
    data: employee
  });
}
onViewSalary(employee: any) {
  console.log(employee,'salary')
  this.router.navigate(['admin/view-salary', employee._id]); // Navigate to SalaryComponent
}

}
