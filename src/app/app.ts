import { Component, LOCALE_ID, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { registerLocaleData, CommonModule } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

registerLocaleData(localeId);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }],
})
export class App {
  title = 'invitation-wedding-app';
  isMenuOpen = false;
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);
  customPage: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event: NavigationEnd) => {
        this.customPage = event.urlAfterRedirects.includes('custom');
      });
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  scrollToSection(sectionId: string) {
    this.closeMenu();

    // Check if we are on the home page
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on home, navigate to home then scroll
      this.router.navigate(['/']).then(() => {
        // Small delay to allow navigation to complete
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    }
  }
}
