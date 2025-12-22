import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/service/settings.service';

@Component({
  selector: 'app-leave-setting',
  templateUrl: './leave-setting.component.html',
  styleUrls: ['./leave-setting.component.scss']
})
export class LeaveSettingComponent implements OnInit {

   leaveSettings = {
    maxAnnualLeaves: 0,
    maxCasualLeaves: 0,
    maxSickLeaves: 0,
    allowCarryForward: false
  };

  loading = false;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getLeaveSettings();
  }

  // 🔹 Fetch leave settings on load
  getLeaveSettings() {
    this.loading = true;
    this.settingsService.getLeave().subscribe({
      next: (res: any) => {
        this.leaveSettings = res.settings || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch leave settings:', err);
        this.loading = false;
        this.snackBar.open('Failed to load leave settings', 'Close', { duration: 3000 });
      }
    });
  }

  // 🔹 Save updated leave settings
  saveLeaveSettings() {
    this.loading = true;
    this.settingsService.updateLeave(this.leaveSettings).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open('Leave settings updated successfully', 'Close', { duration: 3000 });
      },
      error: (err:any) => {
        console.error('Error updating leave settings:', err);
        this.loading = false;
        this.snackBar.open('Error updating leave settings', 'Close', { duration: 3000 });
      }
    });
  }

}
