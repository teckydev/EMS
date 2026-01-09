import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth.service';
import { EmployeeService } from 'src/app/core/service/employee.service';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss']
})
export class ProfileSummaryComponent implements OnInit {
employee: any;
  isLoading = true;
  errorMessage = '';
  constructor(private employeeService:EmployeeService,private authService:AuthService) { }

  ngOnInit(): void {
    this.loadProfile();
   
  }

   loadProfile() {
    this.employeeService.getMyProfile().subscribe({
      next: (res) => {
        console.log('Profile data:', res);
        if (res.success) {
          this.employee = res.employee;
        } else {
          console.warn('No profile found');
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      },
    });
  }
 getPhotoUrl(path: string): string {
  // Assuming path stored in DB is 'public/uploads/photo-xxxx.png'
  const fileName = path.split('/').pop(); // get 'photo-xxxx.png'
  return `http://localhost:5000/uploads/${fileName}`;
}
}
