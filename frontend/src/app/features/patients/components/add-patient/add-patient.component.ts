import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
      <h2 class="text-2xl font-semibold mb-6 text-gray-700">Add New Patient</h2>

      <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" novalidate>
        <div class="mb-4">
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" id="firstName" formControlName="firstName"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('firstName')}">
          <div *ngIf="isControlInvalid('firstName')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('firstName')?.errors?.['required']">First Name is required.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" id="lastName" formControlName="lastName"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('lastName')}">
          <div *ngIf="isControlInvalid('lastName')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('lastName')?.errors?.['required']">Last Name is required.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input type="date" id="dateOfBirth" formControlName="dateOfBirth"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('dateOfBirth')}">
          <div *ngIf="isControlInvalid('dateOfBirth')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('dateOfBirth')?.errors?.['required']">Date of Birth is required.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select id="gender" formControlName="gender"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  [ngClass]="{'border-red-500': isControlInvalid('gender')}">
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div *ngIf="isControlInvalid('gender')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('gender')?.errors?.['required']">Gender is required.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="email" formControlName="email"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('email')}">
          <div *ngIf="isControlInvalid('email')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('email')?.errors?.['required']">Email is required.</span>
            <span *ngIf="patientForm.get('email')?.errors?.['email']">Please enter a valid email address.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" id="phone" formControlName="phone"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('phone')}">
          <div *ngIf="isControlInvalid('phone')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('phone')?.errors?.['required']">Phone number is required.</span>
          </div>
        </div>

        <div class="mb-4">
          <label for="ssn" class="block text-sm font-medium text-gray-700 mb-1">SSN</label>
          <input type="text" id="ssn" formControlName="ssn"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                 [ngClass]="{'border-red-500': isControlInvalid('ssn')}">
          <div *ngIf="isControlInvalid('ssn')" class="text-red-600 text-xs mt-1">
            <span *ngIf="patientForm.get('ssn')?.errors?.['required']">SSN is required.</span>
          </div>
        </div>

        <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>

        <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Success!</strong>
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>

        <div class="flex justify-between items-center">
          <button (click)="goBack()"
                  class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors shadow">
            Cancel
          </button>
          <button type="submit" [disabled]="patientForm.invalid || isSubmitting"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Saving...' : 'Save Patient' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AddPatientComponent implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private router = inject(Router);
  private location = inject(Location);

  patientForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      ssn: ['', [Validators.required]]
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.patientForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.patientForm.markAllAsTouched();

    if (this.patientForm.invalid) {
      console.warn('Form is invalid');
      return;
    }

    this.isSubmitting = true;

    const patientData = this.patientForm.value;

    this.patientService.addPatient(patientData).subscribe({
      next: (newPatient) => {
        this.isSubmitting = false;
        this.successMessage = `Patient "${newPatient.firstName}" added successfully (ID: ${newPatient.id}).`;
        console.log('Patient added:', newPatient);

        setTimeout(() => {
          this.router.navigate(['/patients']);
        }, 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = `Failed to add patient: ${err.message || 'Unknown server error'}`;
        console.error('Error adding patient:', err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}