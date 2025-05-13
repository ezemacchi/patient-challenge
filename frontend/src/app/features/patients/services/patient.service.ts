import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, map, catchError, switchMap, tap, shareReplay } from 'rxjs';
import { Patient } from '../models/patient.model';
import { PaginatedResponse } from '../models/paginatedResponse.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5251/api/patients';

  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  private dataLoaded = false;

  constructor() {}

  /**
   * Load patients from the API with optional pagination.
   * @param skip Number of records to skip (default: 0).
   * @param limit Number of records to fetch (default: 20).
   */
  loadPatients(skip: number = 0, limit: number = 20): void {
    this.http
      .get<PaginatedResponse>(`${this.apiUrl}?skip=${skip}&limit=${limit}`)
      .pipe(
        tap((response) => {
          this.patientsSubject.next(response.data || []);
          this.dataLoaded = true;
          console.log('Patients loaded from API:', response);
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  /**
   * Get all patients as an observable.
   * @returns Observable of the patients array.
   */
  getAllPatients(): Observable<Patient[]> {
    if (!this.dataLoaded) {
      this.loadPatients();
    }
    return this.patients$;
  }

  /**
   * Get a single patient by ID.
   * @param id The ID of the patient to fetch.
   * @returns Observable of the patient object.
   */
  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      tap((patient) => console.log(`Patient ${id} fetched from API:`, patient)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a patient by ID.
   * @param id The ID of the patient to delete.
   * @returns Observable of the delete operation.
   */
  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentPatients = this.patientsSubject.getValue();
        const updatedPatients = currentPatients.filter((p) => p.id !== id);
        this.patientsSubject.next(updatedPatients);
        console.log(`Patient ${id} deleted successfully.`);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Add a new patient.
   * @param patientData The data of the patient to add.
   * @returns Observable of the newly created patient.
   */
  addPatient(patientData: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patientData).pipe(
      tap((newPatient) => {
        const currentPatients = this.patientsSubject.getValue();
        this.patientsSubject.next([...currentPatients, newPatient]);
        console.log('New patient added:', newPatient);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle API errors.
   * @param error The HTTP error response.
   * @returns Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}