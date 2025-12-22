import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UserProfile } from 'src/app/core/model/User-model';
import { SettingsService } from 'src/app/core/service/settings.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
profileForm!: FormGroup;
  passwordForm!: FormGroup;

 // Loading states
  pageLoading = true; // For initial data load
  profileSaving = false;
  passwordSaving = false;

  // Password visibility
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  constructor(private fb: FormBuilder, private userService: SettingsService, 
    private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    // === Profile Form Initialization ===
   this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
       departmentName: [''],
      jobTitle: [''],
    });

    // === Password Form Initialization ===
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
      },
      {
        // // Add our custom validator to the form group
        // validator: MustMatch('newPassword', 'confirmPassword'),
      }
    );
    this.loadUserProfile();
  }
// === Form Submission Handlers ===
// account-settings.component.ts

loadUserProfile(): void {
  this.pageLoading = true;
  this.userService.getProfile().subscribe({
    next: (response: any) => {
      // 1. Extract the employee object
      const employeeData = response.employee; 

      // 2. Map the API structure to the Form structure
      const mappedFormData = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        // Map API field 'position' to form field 'jobTitle'
        jobTitle: employeeData.position, 
        // Map API nested field 'department.name' to form field 'departmentName'
        departmentName: employeeData.department ? employeeData.department.name : '',
        // IMPORTANT: You might need to store the Department ID for the API update
        departmentId: employeeData.department ? employeeData.department._id : '' 
      };
console.log(mappedFormData,'profile')
      // 3. Patch the form
      this.profileForm.patchValue(mappedFormData);
      this.pageLoading = false;
    },
    error: (err) => {
      this.openSnackBar(`Error loading profile: ${err.message}`, 'Error');
      this.pageLoading = false;
    },
  });
}

  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.profileSaving = true;
    const profileData = this.profileForm.value ;

    this.userService
      .updateProfile(profileData)
      .pipe(finalize(() => (this.profileSaving = false))) // Always stop spinner
      .subscribe({
        next: (updatedProfile) => {
          this.profileForm.patchValue(updatedProfile); // Optional: sync with server response
          this.openSnackBar('Profile updated successfully!', 'Success');
        },
        error: (err) => {
          this.openSnackBar(`Update failed: ${err.error?.message || err.message}`, 'Error');
        },
      });
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordSaving = true;
  // 1. Destructure all three fields, mapping confirmPassword to confirmNewPassword
    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    // 2. Construct the payload with the correct backend key names
    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      // Map frontend 'confirmPassword' to backend 'confirmNewPassword'
      confirmNewPassword: confirmPassword 
    };
    this.userService
      .changePassword(payload)
      .pipe(finalize(() => (this.passwordSaving = false)))
      .subscribe({
        next: () => {
          this.openSnackBar('Password updated successfully!', 'Success');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.openSnackBar(`Update failed: ${err.error?.message || err.message}`, 'Error');
        },
      });
  }

  // Helper for snackbar
  openSnackBar(message: string, panelClass: 'Success' | 'Error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass.toLowerCase() + '-snackbar'], // For styling
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
 get email() {
  return this.profileForm.get('email');
}
get newPassword() {
  return this.passwordForm.get('newPassword');
}
get confirmPassword() {
  return this.passwordForm.get('confirmPassword');
}
}
