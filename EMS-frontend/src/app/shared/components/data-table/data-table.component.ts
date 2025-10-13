import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmployeeViewComponent } from 'src/app/modules/admin/pages/employee-view/employee-view.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() columns: any[] = [];
  @Input() dataSource: any[] = [];
  @Input() showActions: boolean = true;
  @Input() showView: boolean = true;
  @Input() showSalary: boolean = true;
  @Input() showTitle: string = '';
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() salary = new EventEmitter<any>();
  @ViewChild(MatSort) sort!: MatSort;

  // Pagination
  paginatedData: any[] = [];
  pageSize: number = 5;
  pageIndex: number = 0;

  searchText: string = '';
  filteredDataSource: any[] = [];
  constructor(private dialog: MatDialog) {}
  ngOnChanges() {
    this.filteredDataSource = [...this.dataSource];
    this.updatePaginatedData();
  }
  onSalary(row: any) {
    this.salary.emit(row);
  }
  ngOnInit(): void {
    this.filteredDataSource = this.dataSource;
  }

  ngAfterViewInit() {
    // Attach sorting after view initializes
    this.sort.sortChange.subscribe(() => {
      this.sortData();
    });
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredDataSource = [...this.dataSource];
      console.log(this.filteredDataSource, 'dts');
    } else {
      const filter = this.searchText.toLowerCase();
      this.filteredDataSource = this.dataSource.filter((row) =>
        this.columns.some((col) =>
          (row[col.key] + '').toLowerCase().includes(filter)
        )
      );
    }
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  sortData() {
    const active = this.sort.active;
    const direction = this.sort.direction;

    if (!active || direction === '') {
      this.filteredDataSource = [...this.dataSource];
    } else {
      this.filteredDataSource = [...this.filteredDataSource].sort((a, b) => {
        const valueA = a[active];
        const valueB = b[active];
        const comparator = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        return direction === 'asc' ? comparator : -comparator;
      });
    }
    this.updatePaginatedData();
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }

  get displayedColumns(): string[] {
    const base = this.columns?.map((c) => c.key) || [];
    return this.showActions ? [...base, 'actions'] : base;
  }

  updatePaginatedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredDataSource.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedData();
  }
  onView(row: any) {
    this.view.next(row);
  }
}
