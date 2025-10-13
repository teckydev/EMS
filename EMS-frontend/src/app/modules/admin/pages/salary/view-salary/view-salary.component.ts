import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalaryService } from 'src/app/core/service/salary.service';

@Component({
  selector: 'app-view-salary',
  templateUrl: './view-salary.component.html',
  styleUrls: ['./view-salary.component.scss']
})
export class ViewSalaryComponent implements OnInit {
columnsSchema = [
   { key: 'empId', label: 'Employee ID', render: (row: any) => row.employee?.empId },
  { key: 'basicSalary', label: 'Basic Salary' },
  { key: 'allowances', label: 'Allowances' },
  { key: 'deductions', label: 'Deductions' },
  { key: 'netPay', label: 'Net Pay' },
  { key: 'payDate', label: 'Pay Date', render: (row: any) => new Date(row.payDate).toLocaleDateString() }
];

 employeeId!: string;
  salaries: any[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private salaryService: SalaryService,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Get employeeId from route param
    this.employeeId = this.route.snapshot.paramMap.get('employeeId')!;
    console.log(this.employeeId,'Id')
    this.fetchSalaries();
  }

  fetchSalaries() {
    console.log("salarie")
    this.loading = true;
    this.salaryService.getSalaryByEmployee(this.employeeId).subscribe({
      next: (res) => {
        this.salaries = res.salaryHistory

        console.log(this.salaries,'check view')
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching salaries', err);
        this.loading = false;
      }
    });
  }

   onEdit(salaryHistory: any) {
    console.log(salaryHistory,'sh')
      console.log("edit")
       this.router.navigate(['admin/salary', salaryHistory._id]); // Navigate to SalaryComponent
    }
     onDelete(salary: any) {
      console.log(salary,'delete-salary')
    if (confirm('Are you sure you want to delete this salary?')) {
      this.salaryService
        .deleteSalary(salary._id)
        .subscribe(() => this.fetchSalaries());
    }
  }
}
