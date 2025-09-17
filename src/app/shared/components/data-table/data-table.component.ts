import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
@Input() columns: any[] = [];
  @Input() dataSource: any[] = [];
  @Input() showActions: boolean = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
searchText: string = '';
  filteredDataSource: any[] = [];
    applyFilter() {
    if (!this.searchText) {
      this.filteredDataSource = this.dataSource;
    } else {
      const filter = this.searchText.toLowerCase();
      this.filteredDataSource = this.dataSource.filter(row =>
        this.columns.some(col => (row[col.key] + '').toLowerCase().includes(filter))
      );
    }
  }
  onEdit(row: any) {
    console.log("eee")
    this.edit.emit(row);
  }

  onDelete(row: any) {
    this.delete.emit(row);
  }
  constructor() { }

  ngOnInit(): void {
    // Initialize filtered data when input changes
    this.filteredDataSource = this.dataSource;
  }
get displayedColumns(): string[] {
    const base = this.columns?.map(c => c.key) || [];
    return this.showActions ? [...base, 'actions'] : base;
  }
}
