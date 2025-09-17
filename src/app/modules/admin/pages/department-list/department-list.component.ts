import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { DepartmentService } from 'src/app/core/service/department.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
departments: any[] = [];
   departmentColumns: any[] = [
   { key: 'sno', label: 'S.No' },
    { key: 'name', label: 'Department Name' },
    { key: 'description', label: 'Description' }
  ];
  constructor(
     private departmentService: DepartmentService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
   this.loadDepartments()
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDepartments(); // refresh list after adding
      }
    });
  }
 
loadDepartments() {
  this.departmentService.getDepartments().subscribe((data: any[]) => {
   this.departments = data.map((d, i) => ({
  sno: i + 1,
  id: d.id || d._id,   // ✅ map correct ID field
  name: d.name,
  description: d.description
}));

  });
}
// ✅ Edit department
  onEditDepartment(department: any) {
    const dialogRef = this.dialog.open(AddDepartmentComponent, {
      width: '400px',
      data: department   // pass existing data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadDepartments();
    });
  } 

 
  onDeleteDepartment(department: any) {
  if (confirm(`Are you sure to delete ${department.name}?`)) {
    this.departmentService.deleteDepartment(department.id).subscribe(() => this.loadDepartments());
  }
}
}
