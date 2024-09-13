import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';

interface Instrument {
  displayName: string;
}

interface LinkedEvent {
  activityID: string;
}

interface Flare {
  flrID: string;
  instruments: Instrument[];
  beginTime: string;
  peakTime: string;
  endTime: string | null;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
  note: string | null;
  submissionTime: string;
  link: string;
  linkedEvents: LinkedEvent[];
}


@Component({
  selector: 'app-list-data',
  standalone: true,
  imports: [CommonModule, FormsModule], // No need to import HttpClientModule here
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.css']
})
export class ListDataComponent implements OnInit {
  flares: Flare[] = []; // Full data with Flare type
  pagedData: Flare[] = []; // Paginated data
  filteredData: Flare[] = []; // Filtered data
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: keyof Flare = 'flrID'; // Default sort field
  searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getFlareData().subscribe(data => {
      this.flares = data;
      this.filteredData = this.flares;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.pagedData = this.filteredData.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  sort(field: keyof Flare): void {
    this.sortField = field;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    this.filteredData.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Convert null or undefined to empty strings for comparison
      const normalizedValueA = valueA !== null && valueA !== undefined ? valueA : '';
      const normalizedValueB = valueB !== null && valueB !== undefined ? valueB : '';

      // Handle string values
      if (typeof normalizedValueA === 'string' && typeof normalizedValueB === 'string') {
        return this.sortDirection === 'asc'
          ? normalizedValueA.localeCompare(normalizedValueB)
          : normalizedValueB.localeCompare(normalizedValueA);
      }

      // Handle number values
      if (typeof normalizedValueA === 'number' && typeof normalizedValueB === 'number') {
        return this.sortDirection === 'asc' ? normalizedValueA - normalizedValueB : normalizedValueB - normalizedValueA;
      }

      // Handle other types
      return 0;
    });

    this.updatePagination();
  }


  filter(): void {
    this.filteredData = this.flares.filter(flare => {
      return Object.values(flare).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(this.searchTerm.toLowerCase());
        }
        // Handle arrays or other types if needed
        return false;
      });
    });
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }
}
