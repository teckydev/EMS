import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/service/settings.service';

@Component({
  selector: 'app-attendance-setting',
  templateUrl: './attendance-setting.component.html',
  styleUrls: ['./attendance-setting.component.scss']
})
export class AttendanceSettingComponent implements OnInit {

  attendanceSettings = {
    defaultStartTime: '09:00',
    defaultEndTime: '18:00',
    overtimeEnabled: false,
    publicHolidays: [] as { name: string; date: string }[]
  };

  loading = false;

  constructor(
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAttendanceSettings();
  }

  // 🔹 Fetch settings on load
  getAttendanceSettings() {
    this.loading = true;
    this.settingsService.getAttendance().subscribe({
      next: (res: any) => {
        this.attendanceSettings = res.settings || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading attendance settings:', err);
        this.loading = false;
        this.snackBar.open('Failed to load attendance settings', 'Close', { duration: 3000 });
      }
    });
  }

  // 🔹 Add new holiday
  addHoliday() {
    this.attendanceSettings.publicHolidays.push({ name: '', date: '' });
  }

  // 🔹 Remove holiday
  removeHoliday(index: number) {
    this.attendanceSettings.publicHolidays.splice(index, 1);
  }

  // 🔹 Save updated settings
  saveAttendanceSettings() {
    this.loading = true;
    const payload = {
      ...this.attendanceSettings,
      // Convert dates to ISO if needed
      publicHolidays: this.attendanceSettings.publicHolidays.map(h => ({
        name: h.name,
        date: new Date(h.date).toISOString()
      }))
    };

    this.settingsService.updateAttendance(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackBar.open('Attendance settings updated successfully', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error updating attendance settings:', err);
        this.snackBar.open('Error saving attendance settings', 'Close', { duration: 3000 });
      }
    });
  }

}
