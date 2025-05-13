import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Import Location for back navigation
import { ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute for route params, RouterModule for routerLink
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import necessary modules
  template: `
    <div class="bg-white shadow-md rounded-lg p-6">
      <button (click)="goBack()" class="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors shadow inline-flex items-center">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
           <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
         </svg>
        Back to List
      </button>

      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Patient Details</h2>

      <div *ngIf="isLoading" class="text-center py-4 text-gray-500">
        Loading patient details...
      </div>

      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>

      <div *ngIf="patient && !isLoading && !errorMessage" class="space-y-3">
        <p><strong>ID:</strong> {{ patient?.id }}</p>
        <p><strong>Name:</strong> {{ patient?.firstName }} {{ patient?.lastName }}</p>
        <p><strong>Gender:</strong> {{ patient?.gender }}</p>
        <p><strong>Email:</strong> <a [href]="'mailto:' + patient?.email" class="text-blue-600 hover:underline">{{ patient.email }}</a></p>
        <p><strong>Phone:</strong> {{ patient?.phone }}</p>
        </div>

      <div *ngIf="!patient && !isLoading && !errorMessage" class="text-center py-4 text-gray-500">
          Patient not found.
        </div>
    </div>
  `,
   styles: [`
    :host { display: block; }
  `]
})
export class PatientDetailComponent implements OnInit {
  // Inject services and router dependencies
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private location = inject(Location); // Inject Location service

  patient: Patient | null | undefined = null; // Holds the fetched patient data
  isLoading = true; // Loading state flag
  errorMessage: string | null = null; // Error message holder

  // Use @Input() to bind route parameter 'id' directly to this property
  // Requires withComponentInputBinding() in provideRouter (app.config.ts)
  @Input() id?: string; // Input property for the patient ID from the route

  ngOnInit(): void {
    this.loadPatientDetails();
  }

  loadPatientDetails(): void {
     if (!this.id) {
        this.errorMessage = "Patient ID is missing.";
        this.isLoading = false;
        console.error("Patient ID not provided in route.");
        return;
     }

     const patientId = this.id;

     this.isLoading = true;
     this.errorMessage = null;

     this.patientService.getPatientById(patientId).pipe(
        tap(patient => {
            this.patient = patient;
            this.isLoading = false;
            if (!patient) {
                this.errorMessage = `Patient with ID ${patientId} not found.`;
                console.warn(`Patient ${patientId} not found.`);
            } else {
                console.log('Patient details loaded:', patient);
            }
        }),
        catchError(err => {
            this.isLoading = false;
            this.errorMessage = `Failed to load patient details: ${err.message || 'Unknown error'}`;
            this.patient = null; // Ensure patient is null on error
            console.error('Error loading patient details:', err);
            return of(null); // Return an observable of null to complete the stream gracefully
        })
     ).subscribe(); // Subscribe to trigger the observable pipeline
  }

  goBack(): void {
    this.location.back();
  }
}