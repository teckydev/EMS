import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface Activity {
  employee: string;
  action: string;
  date: string;
  status: string;
}
@Component({
  selector: 'app-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss']
})
export class RecentActivityComponent implements OnInit {
   @Input() recentActivity: any[] = []; 
     dataSource!: MatTableDataSource<any>;
      displayedColumns: string[] = ['employee', 'action', 'status'];
     @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor() { }

  ngOnInit(): void {
     this.dataSource = new MatTableDataSource(this.recentActivity);
     console.log(this.recentActivity,'recent activity');
  }
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['recentActivity']) {
      this.dataSource = new MatTableDataSource(this.recentActivity);

      setTimeout(() => {
        if (this.paginator) this.dataSource.paginator = this.paginator;
        if (this.sort) this.dataSource.sort = this.sort;
      });
    }
  }
ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
