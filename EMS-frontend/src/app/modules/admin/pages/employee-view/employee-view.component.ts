import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data,'data')
   }

  ngOnInit(): void {
  }
// ✅ Helper to build full URL for photo
  getPhotoUrl(photoPath: string): string {
    if (!photoPath) {
      return 'assets/default-user.png'; // fallback if photo is missing
    }
    return `http://localhost:5000/${photoPath}`;
  }
}
