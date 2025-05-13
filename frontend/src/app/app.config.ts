import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

// Application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Enable router features like binding route params to component inputs
    provideHttpClient(withInterceptorsFromDi()), // Provide HttpClient globally
    // Add other global providers here if needed
  ]
};
