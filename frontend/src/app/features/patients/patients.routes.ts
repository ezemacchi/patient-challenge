import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { AddPatientComponent } from './components/add-patient/add-patient.component'; // Import the new component

// Routes specific to the patients feature
export const PATIENTS_ROUTES: Routes = [
  {
    path: '',
    component: PatientListComponent,
    title: 'Patient List'
  },
  {
    path: 'add', // Route for '/patients/add'
    component: AddPatientComponent, // Map to the AddPatientComponent
    title: 'Add New Patient' // Set browser title
  },
  {
    path: ':id',
    component: PatientDetailComponent,
    title: 'Patient Details'
  },
];