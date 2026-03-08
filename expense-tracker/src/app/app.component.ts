import { Component, OnInit } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent],
  template: `<app-dashboard></app-dashboard>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service initializes automatically
    // This ensures the theme is applied on app startup
  }
}