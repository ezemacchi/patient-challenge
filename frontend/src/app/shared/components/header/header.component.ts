import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
        <a routerLink="/patients" class="text-xl font-bold hover:text-blue-200 transition-colors">
          Patient Management
        </a>
        <div>
          <!-- Add navigation links or buttons here -->
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {}