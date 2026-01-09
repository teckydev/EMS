import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { EmployeeService } from 'src/app/core/service/employee.service';
import { NotificationService } from 'src/app/core/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading:boolean=false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
     private notificationService: NotificationService,
     private employeeService:EmployeeService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
          console.log('Login successful', res);
          localStorage.setItem('token', res.token); // store JWT token
          localStorage.setItem('user', JSON.stringify(res.user));
          // Navigate to admin or user dashboard based on role
          // Navigate to dashboard based on role
           // 🔌 Connect to Socket.IO with employee ID
        // this.notificationService.connect(res.user.id);
        if (res.user.role === 'employee') {
  this.employeeService.getEmployeeByUserId(res.user.id).subscribe({
    next: (data) => {
      const employee = data.employee;
      console.log('👤 Employee record fetched:', employee);

      // Store Employee ID locally
      localStorage.setItem('employeeId', employee._id);

      // Connect WebSocket using employee._id
      this.notificationService.connect(employee._id);

      // Navigate to employee dashboard
      this.router.navigate(['/user']);
      
    },
    error: (err) => {
      console.error('❌ Failed to fetch employee record:', err);
      this.router.navigate(['/user']); // fallback navigation
    },
  });
  
}
 else if (res.user.role === 'admin') {
      console.log('🧑‍💼 Admin logged in');
      this.router.navigate(['/admin/dashboard']);
    }
        //   if (res.user.role === 'admin') {
        //   this.router.navigate(['/admin/dashboard']);
        // } else {
        //     this.router.navigate(['/user']);
        // }
      },
      error: (err) => {
          console.error(err);
          this.errorMessage = err.error.message || 'Login failed';
      },
    });
    }
  }

  ngOnInit(): void {}
}
