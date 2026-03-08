import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService, THEMES } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="theme-controls">
      <!-- Dark/Light Toggle -->
      <button
        mat-icon-button
        (click)="toggleDarkMode()"
        [matTooltip]="(isDarkMode$ | async) ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        class="toggle-button mode-toggle"
      >
        <mat-icon>{{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>

      <!-- Theme Selector -->
      <button
        mat-icon-button
        [matMenuTriggerFor]="themeMenu"
        matTooltip="Choose Theme"
        class="toggle-button"
      >
        <mat-icon>palette</mat-icon>
      </button>

      <mat-menu #themeMenu="matMenu" class="theme-menu">
        <div mat-menu-item class="theme-header">
          <span>Available Themes</span>
        </div>
        
        <button
          *ngFor="let theme of themeList | keyvalue"
          mat-menu-item
          (click)="setTheme(theme.key)"
          [class.active]="(currentTheme$ | async) === theme.key"
          class="theme-option"
        >
          <span class="color-swatch" [style.background-color]="theme.value.accentColor"></span>
          <div class="theme-info">
            <span class="theme-name">{{ theme.value.name }}</span>
            <span class="theme-vibe">{{ theme.value.vibe }}</span>
          </div>
          <mat-icon *ngIf="(currentTheme$ | async) === theme.key" class="check-icon">
            check_circle
          </mat-icon>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .theme-controls {
      display: flex;
      gap: 8px;
      align-items: center;

      .toggle-button {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        transition: all 0.2s;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }

        &:hover {
          background: rgba(var(--primary-rgb), 0.12);
          transform: scale(1.05);
        }
      }
    }

    ::ng-deep .theme-menu {
      .mat-mdc-menu-content {
        padding: 8px 0 !important;
      }

      .theme-header {
        padding: 8px 16px !important;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--text-tertiary);
        letter-spacing: 0.5px;
        cursor: default !important;

        &:hover {
          background: transparent !important;
        }
      }

      .theme-option {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        padding: 12px 16px !important;
        min-width: 280px !important;
        height: auto !important;
        color: var(--text-primary) !important;
        transition: all 0.2s;

        &:hover {
          background: rgba(var(--primary-rgb), 0.1) !important;
        }

        &.active {
          background: rgba(var(--primary-rgb), 0.15) !important;
          border-left: 4px solid var(--primary-color);
        }

        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .theme-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;

          .theme-name {
            font-weight: 500;
            font-size: 14px;
            color: var(--text-primary);
          }

          .theme-vibe {
            font-size: 11px;
            color: var(--text-tertiary);
          }
        }

        .check-icon {
          color: var(--primary-color);
          margin-left: auto;
          flex-shrink: 0;
        }
      }
    }

    @media (max-width: 768px) {
      .theme-controls {
        gap: 4px;

        .toggle-button {
          width: 36px;
          height: 36px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      ::ng-deep .theme-menu .theme-option {
        min-width: 250px !important;
        padding: 10px 12px !important;

        .theme-name {
          font-size: 12px;
        }

        .theme-vibe {
          font-size: 10px;
        }
      }
    }

    @media (max-width: 480px) {
      .theme-controls {
        gap: 4px;

        .toggle-button {
          width: 36px;
          height: 36px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      ::ng-deep .theme-menu .theme-option {
        min-width: 240px !important;
        padding: 8px 10px !important;
        gap: 8px !important;

        .color-swatch {
          width: 20px;
          height: 20px;
        }

        .theme-info {
          gap: 1px;
        }

        .theme-name {
          font-size: 11px;
        }

        .theme-vibe {
          font-size: 9px;
        }

        .check-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode$!: Observable<boolean>;
  currentTheme$!: Observable<string>;
  themeList = THEMES;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode$ = this.themeService.darkMode$;
    this.currentTheme$ = this.themeService.currentTheme$;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  setTheme(themeName: string): void {
    this.themeService.setTheme(themeName);
  }
}