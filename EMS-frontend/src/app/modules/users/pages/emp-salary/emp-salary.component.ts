import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SalaryService } from 'src/app/core/service/salary.service';

@Component({
  selector: 'app-emp-salary',
  templateUrl: './emp-salary.component.html',
  styleUrls: ['./emp-salary.component.scss']
})
export class EmpSalaryComponent implements OnInit {
  employeeId!: string | null;
  salaries: any[] = [];
columnsSchema = [
   { key: 'empId', label: 'Employee ID', render: (row: any) => row.employee?.empId },
  { key: 'basicSalary', label: 'Basic Salary' },
  { key: 'allowances', label: 'Allowances' },
  { key: 'deductions', label: 'Deductions' },
  { key: 'netPay', label: 'Net Pay' },
  { key: 'payDate', label: 'Pay Date', render: (row: any) => new Date(row.payDate).toLocaleDateString() }
];
  constructor(
    private route: ActivatedRoute,
        private salaryService: SalaryService,
    private authService:AuthService,

        private router:Router
  ) { }

  ngOnInit(): void {
   
    this.fetchSalaries()
  }
fetchSalaries() {
 const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id; // from login response
console.log(userId,'saaa')
  this.salaryService.getSalaryForEmployee().subscribe({
    next: (res) => {
       // Attach employee info to each salary record
      const employee = res.employee;
      this.salaries = res.salaryHistory.map((record: any) => ({
        ...record,
        employee, // add the employee data to each record
      }));
      console.log('Employee salary records:', this.salaries);
    },
    error: (err) => console.error('Error fetching salary', err)
  });
  }
}
