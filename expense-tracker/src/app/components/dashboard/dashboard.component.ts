import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { PdfReportService } from '../../services/pdf-report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatDividerModule,
    ExpenseFormComponent,
    ExpenseListComponent,
    ThemeSwitcherComponent
  ],
  template: `
    <!-- Main Toolbar -->
    <mat-toolbar class="main-toolbar">
      <div class="toolbar-content">
        <!-- Logo & Title -->
        <div class="logo-section">
          <mat-icon class="logo-icon">savings</mat-icon>
          <div class="title-group">
            <h1>Expense Tracker</h1>
            <p>Track your spending, manage your budget</p>
          </div>
        </div>

        <!-- Toolbar Actions -->
        <div class="toolbar-actions">
          <button
            mat-raised-button
            color="accent"
            (click)="generatePDF()"
            class="report-button"
            matTooltip="Generate monthly PDF report"
          >
            <mat-icon>picture_as_pdf</mat-icon>
            <span>Report</span>
          </button>
          <app-theme-switcher></app-theme-switcher>
        </div>
      </div>
    </mat-toolbar>

    <!-- Main Content -->
    <div class="main-content">
      <mat-tab-group class="content-tabs" animationDuration="300">
        <!-- Add Expense Tab -->
        <mat-tab label="Add Expense">
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">add_circle</mat-icon>
            <span>Add Expense</span>
          </ng-template>
          <div class="tab-content">
            <app-expense-form></app-expense-form>
          </div>
        </mat-tab>

        <!-- View Expenses Tab -->
        <mat-tab label="View Expenses">
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">list_alt</mat-icon>
            <span>View Expenses</span>
          </ng-template>
          <div class="tab-content">
            <app-expense-list></app-expense-list>
          </div>
        </mat-tab>

        <!-- About Tab -->
        <mat-tab label="About">
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">info</mat-icon>
            <span>About</span>
          </ng-template>
          <div class="tab-content">
            <mat-card class="about-card">
              <h2>About This App</h2>
              <p class="intro-text">
                A beautiful, responsive expense tracker built with <strong>Angular 19</strong>,
                <strong>Angular Material</strong>, and <strong>TypeScript</strong>.
                All data is stored securely in your browser—no backend required!
              </p>

              <h3>✨ Key Features</h3>
              <ul class="features-list">
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Add expenses with categories and descriptions</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>View by Day, Week, or Month</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Generate PDF reports</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>4 theme options (Cyber, Emerald, Nordic, Sunset)</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Dark/Light mode toggle</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>Fully responsive (Mobile to Desktop)</span>
                </li>
                <li>
                  <mat-icon>check_circle</mat-icon>
                  <span>100% Local Storage (Privacy First)</span>
                </li>
              </ul>

              <mat-divider class="section-divider"></mat-divider>

              <h3>💡 How to Use</h3>
              <ol class="usage-list">
                <li>Go to <strong>"Add Expense"</strong> tab</li>
                <li>Select a <strong>Category</strong> from dropdown</li>
                <li>Enter the <strong>Amount</strong> in INR</li>
                <li>Pick a <strong>Date</strong> using the datepicker</li>
                <li>Add optional <strong>Description</strong></li>
                <li>Click <strong>"Add Expense"</strong> button</li>
                <li>View your expenses in the <strong>"View Expenses"</strong> tab</li>
                <li>Generate <strong>PDF Report</strong> from the top toolbar</li>
              </ol>

              <mat-divider class="section-divider"></mat-divider>

              <h3>🎨 Theme Customization</h3>
              <p>
                Click the <mat-icon class="inline-icon">palette</mat-icon> icon in the top-right
                to switch between different themes. Use the <mat-icon class="inline-icon">dark_mode</mat-icon>
                icon to toggle between Dark and Light modes.
              </p>

              <h3>📱 Responsive Design</h3>
              <p>
                This app works perfectly on iPhones, tablets, and desktop monitors.
                Try resizing your browser to see the responsive layout in action!
              </p>

              <div class="footer-text">
                <p>
                  <strong>Version:</strong> 1.0.0 | <strong>Built with:</strong> ❤️ using Angular 19
                </p>
              </div>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  // ... component code stays the same, replace ONLY the styles section:

styles: [`
    // ============================================
    // TOOLBAR
    // ============================================

    .main-toolbar {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
      color: white;
      padding: 0 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;

      .toolbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 72px;
        gap: 24px;
        max-width: 1400px;
        margin: 0 auto;

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
          min-width: 0;

          .logo-icon {
            font-size: 40px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .title-group {
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;

            h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: -0.5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            p {
              margin: 0;
              font-size: 12px;
              opacity: 0.9;
              font-weight: 300;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;

          .report-button {
            background: rgba(255, 255, 255, 0.25);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s;
            white-space: nowrap;

            &:hover {
              background: rgba(255, 255, 255, 0.35);
              transform: translateY(-2px);
            }

            mat-icon {
              margin-right: 8px;
            }

            span {
              font-weight: 500;
            }
          }
        }
      }
    }

    // ============================================
    // MAIN CONTENT
    // ============================================

    .main-content {
      background: var(--bg-color);
      color: var(--text-primary);
      min-height: calc(100vh - 72px);
      padding: 24px 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .content-tabs {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 16px;

        ::ng-deep {
          .mat-mdc-tab-labels {
            background: var(--surface-color);
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 24px;
            border-radius: 12px 12px 0 0;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;

            .mat-mdc-tab {
              min-width: 150px;
              min-height: 56px;
              color: var(--text-secondary);
              font-weight: 500;
              flex-shrink: 0;

              &.mat-mdc-tab-active {
                color: var(--primary-color);

                .mdc-tab__content {
                  opacity: 1;
                }
              }

              .mdc-tab__text-label {
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
              }

              .tab-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
              }
            }
          }

          .mat-mdc-tab-body-wrapper {
            .mat-mdc-tab-body {
              visibility: visible !important;
            }
          }
        }

        .tab-content {
          padding: 24px 0;
          animation: fadeIn 0.3s;
        }
      }
    }

    // ============================================
    // ABOUT SECTION
    // ============================================

    .about-card {
      background: var(--surface-color);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 32px;
      max-width: 800px;
      margin: 24px auto;

      h2 {
        color: var(--primary-color);
        font-size: 28px;
        margin: 0 0 16px;
        font-weight: 700;
      }

      h3 {
        color: var(--primary-color);
        font-size: 18px;
        margin: 24px 0 16px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      p {
        color: var(--text-secondary);
        line-height: 1.8;
        margin: 0 0 16px;
        font-size: 15px;

        strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        &.intro-text {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
      }

      .features-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          color: var(--text-secondary);
          font-size: 15px;

          mat-icon {
            color: var(--success-color);
            font-size: 20px;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
          }

          span {
            line-height: 1.5;
          }
        }
      }

      .usage-list {
        list-style: decimal;
        padding-left: 24px;
        margin: 0;

        li {
          padding: 8px 0;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;

          strong {
            color: var(--text-primary);
            font-weight: 600;
          }
        }
      }

      .section-divider {
        margin: 24px 0;
        background: var(--border-color);
      }

      .inline-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        vertical-align: middle;
        margin: 0 2px;
        color: var(--primary-color);
      }

      .footer-text {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid var(--border-color);
        text-align: center;
        color: var(--text-tertiary);
        font-size: 13px;

        p {
          margin: 0;
        }
      }
    }

    // ============================================
    // ANIMATIONS
    // ============================================

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // ============================================
    // TABLET (iPad) - 768px to 1024px
    // ============================================

    @media (max-width: 1024px) {
      .main-toolbar .toolbar-content {
        gap: 16px;
        height: 64px;

        .logo-section {
          gap: 12px;

          .logo-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }

          .title-group {
            h1 {
              font-size: 20px;
            }

            p {
              font-size: 11px;
            }
          }
        }

        .toolbar-actions {
          gap: 8px;

          .report-button {
            font-size: 13px;
            padding: 8px 12px;
          }
        }
      }

      .main-content {
        padding: 16px 0;

        .content-tabs {
          padding: 0 12px;

          ::ng-deep .mat-mdc-tab-labels .mat-mdc-tab {
            min-width: 120px;
            font-size: 12px;
          }
        }
      }

      .about-card {
        padding: 24px;
        margin: 16px auto;

        h2 {
          font-size: 24px;
        }

        h3 {
          font-size: 16px;
        }
      }
    }

    // ============================================
    // MOBILE - Below 768px
    // ============================================

    @media (max-width: 768px) {
      .main-toolbar .toolbar-content {
        gap: 12px;
        height: auto;
        padding: 8px 0;
        flex-wrap: wrap;

        .logo-section {
          width: 100%;
          gap: 10px;

          .logo-icon {
            font-size: 28px;
            width: 28px;
            height: 28px;
            padding: 4px;
          }

          .title-group {
            h1 {
              font-size: 18px;
              margin: 0;
            }

            p {
              font-size: 10px;
              margin: 0;
            }
          }
        }

        .toolbar-actions {
          width: 100%;
          justify-content: space-between;
          gap: 8px;

          .report-button {
            flex: 1;
            font-size: 12px;
            padding: 8px 8px;
            max-width: none;

            span {
              display: none;
            }

            mat-icon {
              margin-right: 0;
            }
          }

          app-theme-switcher {
            flex-shrink: 0;
          }
        }
      }

      .main-content {
        min-height: calc(100vh - auto);
        padding: 12px 0;

        .content-tabs {
          padding: 0 8px;

          ::ng-deep {
            .mat-mdc-tab-labels {
              margin-bottom: 16px;
              border-radius: 8px;

              .mat-mdc-tab {
                min-width: 100px;
                min-height: 48px;
                font-size: 11px;
                padding: 0 8px;

                .tab-icon {
                  font-size: 16px;
                  width: 16px;
                  height: 16px;
                }
              }
            }
          }

          .tab-content {
            padding: 12px 0;
          }
        }
      }

      .about-card {
        padding: 16px;
        margin: 12px 8px;
        max-width: calc(100% - 16px);
        border-radius: 8px;

        h2 {
          font-size: 20px;
          margin-bottom: 12px;
        }

        h3 {
          font-size: 14px;
          margin: 16px 0 12px;
        }

        p {
          font-size: 13px;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .features-list li,
        .usage-list li {
          font-size: 13px;
          padding: 6px 0;
        }

        .section-divider {
          margin: 16px 0;
        }

        .footer-text {
          margin-top: 20px;
          padding-top: 16px;
          font-size: 11px;
        }
      }
    }

    // ============================================
    // SMALL MOBILE - Below 480px (iPhone SE)
    // ============================================

    @media (max-width: 480px) {
      .main-toolbar {
        padding: 0 8px;

        .toolbar-content {
          gap: 8px;
          padding: 6px 0;

          .logo-section {
            gap: 8px;

            .logo-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
              padding: 3px;
            }

            .title-group h1 {
              font-size: 16px;
            }

            .title-group p {
              display: none;
            }
          }

          .toolbar-actions {
            .report-button {
              min-width: 40px;
              height: 40px;
              padding: 0;

              mat-icon {
                margin: 0;
              }
            }

            app-theme-switcher ::ng-deep button {
              width: 36px;
              height: 36px;
            }
          }
        }
      }

      .main-content {
        padding: 8px 0;

        .content-tabs {
          padding: 0 4px;

          ::ng-deep {
            .mat-mdc-tab-labels {
              margin-bottom: 12px;
              border-radius: 6px;

              .mat-mdc-tab {
                min-width: 80px;
                min-height: 44px;
                font-size: 10px;
                padding: 0 6px;

                .tab-icon {
                  display: none;
                }
              }
            }
          }

          .tab-content {
            padding: 8px 0;
          }
        }
      }

      .about-card {
        padding: 12px;
        margin: 8px 4px;
        max-width: calc(100% - 8px);

        h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        h3 {
          font-size: 13px;
          margin: 12px 0 10px;
        }

        p {
          font-size: 12px;
          margin-bottom: 10px;
        }

        .features-list {
          li {
            font-size: 12px;
            padding: 4px 0;
            gap: 8px;

            mat-icon {
              font-size: 16px;
              width: 16px;
              height: 16px;
            }
          }
        }

        .usage-list {
          padding-left: 18px;

          li {
            font-size: 12px;
            padding: 4px 0;
          }
        }
      }
    }
  `]
})
export class DashboardComponent {
  constructor(private pdfService: PdfReportService) { }

  generatePDF(): void {
    this.pdfService.generateMonthlyReport();
  }
}
