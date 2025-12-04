import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/service/settings.service';

@Component({
  selector: 'app-organization-setting',
  templateUrl: './organization-setting.component.html',
  styleUrls: ['./organization-setting.component.scss']
})
export class OrganizationSettingComponent implements OnInit {
settings: any = {
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    timezone: '',
    workingDays: [],
    logo: ''
  };

  allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  timezones = [
    'Asia/Kolkata', 'America/New_York', 'Europe/London',
    'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney'
  ];

  logoFile: File | null = null;
  logoPreview: string | null = null;
  loading = false;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  // Load organization data
  loadSettings() {
    this.loading = true;
    this.settingsService.getOrganization().subscribe({
      next: (res: any) => {
        this.settings = res;
        this.loading = false;
        if (res.logo) {
          this.logoPreview = `http://localhost:5000/${res.logo}`;
        }
      },
      error: (err) => {
        console.error('Error loading organization settings:', err);
        this.loading = false;
      }
    });
  }

  // Toggle working days
  toggleDay(day: string, checked: boolean) {
    const index = this.settings.workingDays.indexOf(day);
    if (checked && index === -1) {
      this.settings.workingDays.push(day);
    } else if (!checked && index > -1) {
      this.settings.workingDays.splice(index, 1);
    }
  }

  // Save organization data
  saveSettings() {
    this.loading = true;
    this.settingsService.updateOrganization(this.settings).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open('Organization settings updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err:any) => {
        this.loading = false;
        console.error('Save error:', err);
        this.snackBar.open('Failed to save organization settings', 'Close', { duration: 3000 });
      }
    });
  }

  // Logo upload
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => (this.logoPreview = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  uploadLogo() {
    // if (!this.logoFile) {
    //   this.snackBar.open('Please select a logo before uploading.', 'Close', { duration: 2000 });
    //   return;
    // }

    // const formData = new FormData();
    // formData.append('logo', this.logoFile);

    // this.http.post('http://localhost:5000/api/settings/logo', formData).subscribe({
    //   next: (res: any) => {
    //     this.logoPreview = `http://localhost:5000/${res.logoPath}`;
    //     this.snackBar.open('Logo uploaded successfully!', 'Close', { duration: 3000 });
    //     this.logoFile = null;
    //   },
    //   error: (err) => {
    //     console.error('Logo upload failed:', err);
    //     this.snackBar.open('Logo upload failed', 'Close', { duration: 3000 });
    //   }
    // });
  }

}
