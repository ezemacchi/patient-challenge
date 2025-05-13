import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable, Subscription, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, tap, catchError } from 'rxjs/operators';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgFor, NgIf, AsyncPipe],
  template: `
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Patient List</h2>

      <div *ngIf="isLoading" class="text-center py-4 text-gray-500">
        Loading patients...
      </div>

      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <div *ngIf="(paginatedPatients$ | async)?.length && !isLoading && !errorMessage; else noPatients" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let patient of paginatedPatients$ | async" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ patient.firstName + " " + patient.lastName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ patient.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <a [routerLink]="['/patients', patient.id]" title="View Details"
                  class="text-blue-600 hover:text-blue-800 transition-colors inline-block p-1 rounded hover:bg-blue-100">
                  View
                </a>
                <button (click)="onDeletePatient(patient.id)" title="Delete Patient"
                  class="text-red-600 hover:text-red-800 transition-colors inline-block p-1 rounded hover:bg-red-100">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!isLoading && !errorMessage && totalPages > 1" class="mt-4 flex justify-between items-center">
        <button (click)="previousPage()" [disabled]="currentPage === 1"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        <span class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>

      <ng-template #noPatients>
        <div *ngIf="!isLoading && !errorMessage" class="text-center py-4 text-gray-500">
          No patients found.
        </div>
      </ng-template>

      <div class="mt-6 text-center">
        <button (click)="navigateToAddPatient()" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors shadow">
          + Add Patient
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    th, td { @apply py-3 px-4; }
  `]
})
export class PatientListComponent implements OnInit, OnDestroy {
  private patientService = inject(PatientService);
  private router = inject(Router);
  private subscriptions = new Subscription();

  isLoading = true;
  errorMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  private currentPageSubject = new BehaviorSubject<number>(this.currentPage);

  allPatients$: Observable<Patient[]> = this.patientService.getAllPatients();
  paginatedPatients$: Observable<Patient[]> | undefined;

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.paginatedPatients$ = combineLatest([
      this.allPatients$,
      this.currentPageSubject.pipe(startWith(this.currentPage))
    ]).pipe(
      map(([patients, currentPage]) => {
        this.totalPages = Math.ceil(patients.length / this.itemsPerPage);
        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return patients.slice(startIndex, endIndex);
      }),
      tap(() => {
        this.isLoading = false;
      }),
      catchError(err => {
        this.isLoading = false;
        this.errorMessage = `Failed to load patients: ${err.message || 'Unknown error'}`;
        console.error('Error in patient list:', err);
        return of([]);
      })
    );

    // If data is already in the cache, reset isLoading immediately
  this.patientService.getAllPatients().subscribe((patients) => {
    if (patients.length > 0) {
      this.isLoading = false;
    }
  });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.currentPageSubject.next(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.currentPageSubject.next(this.currentPage);
    }
  }

  onDeletePatient(id: string): void {
    if (confirm(`Are you sure you want to delete patient ${id}?`)) {
      this.isLoading = true;
      this.subscriptions.add(
        this.patientService.deletePatient(id).subscribe({
          next: () => {
            this.isLoading = false;
            this.currentPageSubject.next(this.currentPage); // Refresh the current page
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = `Failed to delete patient ${id}: ${err.message || 'Unknown error'}`;
            console.error('Error deleting patient:', err);
          }
        })
      );
    }
  }

  navigateToAddPatient(): void {
    this.router.navigate(['/patients/add']);
  }
}