import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bg-gray-700 text-white mt-auto">
      <div class="container mx-auto px-4 py-4 text-center text-sm">
        &copy; {{ currentYear }} Patient Management App. All rights reserved.
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}