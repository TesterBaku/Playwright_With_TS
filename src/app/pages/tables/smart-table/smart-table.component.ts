import { Component } from '@angular/core';

import { SmartTableData } from '../../../@core/data/smart-table';

type ColumnKey = 'id' | 'firstName' | 'lastName' | 'username' | 'email' | 'age';

interface SmartTableRow {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  age: string;
}

interface TableColumn {
  key: ColumnKey;
  title: string;
}

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {
  readonly columns: TableColumn[] = [
    { key: 'id', title: 'ID' },
    { key: 'firstName', title: 'First Name' },
    { key: 'lastName', title: 'Last Name' },
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'E-mail' },
    { key: 'age', title: 'Age' },
  ];

  readonly pageSize = 10;

  rows: SmartTableRow[] = [];
  filterValues: Record<ColumnKey, string> = this.createEmptyRow();
  addDraft: SmartTableRow = this.createEmptyRow();
  editDraft: SmartTableRow = this.createEmptyRow();
  editingRowId: string | null = null;
  isAddMode = false;
  currentPage = 1;

  constructor(private service: SmartTableData) {
    this.rows = this.service.getData().map((row) => this.normalizeRow(row));
  }

  get pagedRows(): SmartTableRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  beginAdd(): void {
    this.isAddMode = true;
    this.addDraft = this.createEmptyRow();
    this.currentPage = 1;
  }

  cancelAdd(): void {
    this.isAddMode = false;
    this.addDraft = this.createEmptyRow();
  }

  createRow(): void {
    this.rows = [this.normalizeRow(this.addDraft), ...this.rows];
    this.cancelAdd();
  }

  beginEdit(row: SmartTableRow): void {
    this.editingRowId = row.id;
    this.editDraft = { ...row };
  }

  cancelEdit(): void {
    this.editingRowId = null;
    this.editDraft = this.createEmptyRow();
  }

  saveEdit(): void {
    if (!this.editingRowId) {
      return;
    }

    this.rows = this.rows.map((row) =>
      row.id === this.editingRowId ? this.normalizeRow(this.editDraft) : row,
    );
    this.cancelEdit();
  }

  deleteRow(row: SmartTableRow): void {
    if (!window.confirm('Are you sure you want to delete?')) {
      return;
    }

    this.rows = this.rows.filter((currentRow) => currentRow.id !== row.id);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  updateFilter(key: ColumnKey, value: string): void {
    this.filterValues[key] = value;
    this.currentPage = 1;
  }

  updateAddValue(key: ColumnKey, value: string): void {
    this.addDraft[key] = value;
  }

  updateEditValue(key: ColumnKey, value: string): void {
    this.editDraft[key] = value;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  isEditing(row: SmartTableRow): boolean {
    return this.editingRowId === row.id;
  }

  private get filteredRows(): SmartTableRow[] {
    return this.rows.filter((row) =>
      this.columns.every((column) => {
        const filterValue = this.filterValues[column.key].trim().toLowerCase();
        if (!filterValue) {
          return true;
        }

        return row[column.key].toLowerCase().includes(filterValue);
      }),
    );
  }

  private createEmptyRow(): SmartTableRow {
    return {
      id: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      age: '',
    };
  }

  private normalizeRow(row: Partial<SmartTableRow>): SmartTableRow {
    return {
      id: String(row.id ?? ''),
      firstName: String(row.firstName ?? ''),
      lastName: String(row.lastName ?? ''),
      username: String(row.username ?? ''),
      email: String(row.email ?? ''),
      age: String(row.age ?? ''),
    };
  }
}
