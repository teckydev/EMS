import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AttendanceService } from 'src/app/core/service/attendance.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { LeaveService } from 'src/app/core/service/leave.service';
import { NotificationService } from 'src/app/core/service/notification.service';
import { SalaryService } from 'src/app/core/service/salary.service';
import { TaskService } from 'src/app/core/service/task.service';

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  isCheckedIn = false;
workedTime = '0h 0m';
pendingTaskCount = 0;
alertCount = 0;

tasks: any[] = [];
  leaves: any[] = [];
  salaries: any[] = [];
  attendance: any[] = [];
  taskCount: number = 0;
  constructor(
     private employeeService: EmployeeService,
      private authService: AuthService,
    private attendanceService: AttendanceService,
    private taskService: TaskService,
    private leaveService: LeaveService,
    private salaryService: SalaryService,
    private notificationService: NotificationService
  ) { }
 employee: any;
  loading = true;
  kpiData: any[] = [];
  employeeId!: string;
  ngOnInit(): void {
    this.loadDashboardData();
    this.listenToNotifications();
  }
   loadDashboardData() {
  this.loading = true;

  forkJoin({
    tasks: this.taskService.getEmployeeTasks(),
    leaves: this.leaveService.getUserLeaves(),
    // salary: this.salaryService.getSalaryByEmployee(this.employeeId),
    attendance: this.attendanceService.getMyAttendance(),
  }).subscribe({
    next: (res) => {
      // ✅ FIXED MAPPING
      this.tasks = res.tasks.tasks;        // array
      this.taskCount = res.tasks.count;    // number

      this.leaves = res.leaves;
      // this.salaries = res.salary.salaryHistory;
      this.attendance = res.attendance.records;
 // ✅ Check-in status
    const today = res.attendance.records?.[0];
    this.isCheckedIn = today?.status === 'Present';

    // ✅ Worked time (convert hours)
    const hours = today?.totalHours || 0;
    this.workedTime = this.formatHours(hours);

    // ✅ Pending tasks
    this.pendingTaskCount =
      res.tasks.tasks.filter((t: any) => t.status !== 'Completed').length;

    // ✅ Alerts
   
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}
formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}
listenToNotifications() {
  this.notificationService.notifications$.subscribe(notifications => {
    this.alertCount = notifications.filter(n => !n.read).length;
  });
}

}