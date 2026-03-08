import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ExpenseService, Expense } from '../../services/expense.service';
import { CurrencyINRPipe } from '../../pipes/currency.pipe';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type ViewType = 'day' | 'week' | 'month';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    FormsModule,
    MatTooltipModule,
    MatPaginatorModule,
    CurrencyINRPipe
  ],
  template: `
    <div class="expense-section">
      <!-- View Controls -->
      <mat-card class="controls-card">
        <div class="control-header">
          <h3>View Expenses</h3>
          <mat-button-toggle-group
            [(value)]="currentView"
            (change)="onViewChange()"
            class="view-toggle"
          >
            <mat-button-toggle value="day">
              <mat-icon>today</mat-icon>
              <span>Today</span>
            </mat-button-toggle>
            <mat-button-toggle value="week">
              <mat-icon>date_range</mat-icon>
              <span>Week</span>
            </mat-button-toggle>
            <mat-button-toggle value="month">
              <mat-icon>calendar_month</mat-icon>
              <span>Month</span>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </mat-card>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <mat-card class="summary-card total-card">
          <div class="card-icon">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          <div class="card-content">
            <span class="card-label">Total Expenses</span>
            <span class="card-value">{{ getTotalAmount() | currencyINR }}</span>
          </div>
        </mat-card>

        <mat-card class="summary-card count-card">
          <div class="card-icon">
            <mat-icon>receipt</mat-icon>
          </div>
          <div class="card-content">
            <span class="card-label">Transactions</span>
            <span class="card-value">{{ filteredExpenses.length }}</span>
          </div>
        </mat-card>

        <mat-card class="summary-card avg-card">
          <div class="card-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="card-content">
            <span class="card-label">Average</span>
            <span class="card-value">{{ getAverageAmount() | currencyINR }}</span>
          </div>
        </mat-card>
      </div>

      <!-- Category Breakdown -->
      <mat-card class="category-card">
        <h4>Breakdown by Category</h4>
        <div class="category-chips">
          <mat-chip
            *ngFor="let cat of getCategoryBreakdown() | keyvalue"
            highlighted
            class="category-chip"
          >
            <mat-icon>label</mat-icon>
            <span class="chip-label">{{ cat.key }}</span>
            <span class="chip-amount">{{ cat.value | currencyINR }}</span>
          </mat-chip>
        </div>
        <div *ngIf="filteredExpenses.length === 0" class="no-data-small">
          <p>No expenses to display</p>
        </div>
      </mat-card>

      <!-- Expenses Table -->
      <mat-card class="table-card">
        <div *ngIf="filteredExpenses.length > 0" class="table-wrapper">
          <table mat-table [dataSource]="filteredExpenses" class="expense-table">
            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon class="col-icon">event</mat-icon>
                Date
              </th>
              <td mat-cell *matCellDef="let element">
                <span class="date-value">{{ element.date | date: 'MMM dd, yyyy' }}</span>
                <span class="time-value">{{ element.date | date: 'HH:mm' }}</span>
              </td>
            </ng-container>

            <!-- Category Column -->
            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon class="col-icon">category</mat-icon>
                Category
              </th>
              <td mat-cell *matCellDef="let element">
                <mat-chip class="category-badge">
                  <mat-icon class="chip-icon">{{ getCategoryIcon(element.category) }}</mat-icon>
                  {{ element.category }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Description Column -->
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon class="col-icon">description</mat-icon>
                Description
              </th>
              <td mat-cell *matCellDef="let element">
                <span class="description-text">
                  {{ element.description || '—' }}
                </span>
              </td>
            </ng-container>

            <!-- Amount Column -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon class="col-icon">currency_rupee</mat-icon>
                Amount
              </th>
              <td mat-cell *matCellDef="let element">
                <span class="amount-value">{{ element.amount | currencyINR }}</span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon class="col-icon">settings</mat-icon>
              </th>
              <td mat-cell *matCellDef="let element">
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteExpense(element.id)"
                  matTooltip="Delete expense"
                  class="delete-btn"
                >
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
          </table>
        </div>

        <div *ngIf="filteredExpenses.length === 0" class="no-data">
          <mat-icon>inbox</mat-icon>
          <h3>No Expenses Found</h3>
          <p>Start by adding your first expense above!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .expense-section {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }

    // ============================================
    // CONTROLS CARD
    // ============================================

    .controls-card {
      background: var(--surface-color);
      color: var(--text-primary);
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
      border-radius: 12px;

      .control-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;

        h3 {
          margin: 0;
          color: var(--primary-color);
          font-size: 20px;
          font-weight: 600;
          flex-shrink: 0;
        }
      }

      .view-toggle {
        display: flex;
        background: rgba(var(--primary-rgb), 0.08);
        border-radius: 8px;
        padding: 4px;

        mat-button-toggle {
          color: var(--text-secondary);
          min-width: 100px;

          &.mat-button-toggle-checked {
            background: var(--primary-color);
            color: white;
          }
        }
      }
    }

    // ============================================
    // SUMMARY CARDS
    // ============================================

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px var(--shadow-color);
        border-color: var(--primary-color);
      }

      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }

      &.total-card .card-icon {
        background: rgba(75, 104, 255, 0.15);
        color: #4B68FF;
      }

      &.count-card .card-icon {
        background: rgba(76, 175, 80, 0.15);
        color: #4CAF50;
      }

      &.avg-card .card-icon {
        background: rgba(255, 152, 0, 0.15);
        color: #FF9800;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-label {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }

      .card-value {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
      }
    }

    // ============================================
    // CATEGORY BREAKDOWN
    // ============================================

    .category-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      margin-bottom: 24px;
      padding: 20px;

      h4 {
        margin: 0 0 16px;
        color: var(--primary-color);
        font-size: 16px;
        font-weight: 600;
      }

      .category-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 0;

        .category-chip {
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--text-primary);
          border-radius: 20px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;

          .chip-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }

          .chip-label {
            font-weight: 500;
            min-width: 80px;
          }

          .chip-amount {
            font-weight: 700;
            color: var(--primary-color);
            margin-left: 8px;
            border-left: 1px solid rgba(var(--primary-rgb), 0.3);
            padding-left: 8px;
          }
        }
      }

      .no-data-small {
        text-align: center;
        padding: 20px;
        color: var(--text-secondary);
        opacity: 0.6;

        p {
          margin: 0;
        }
      }
    }

    // ============================================
    // TABLE
    // ============================================

    .table-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;

      .table-wrapper {
        overflow-x: auto;
      }

      .expense-table {
        width: 100%;
        border-collapse: collapse;

        th {
          background: rgba(var(--primary-rgb), 0.08);
          color: var(--text-primary);
          font-weight: 600;
          padding: 16px 12px;
          text-align: left;
          border-bottom: 2px solid var(--border-color);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;

          .col-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            vertical-align: middle;
          }
        }

        td {
          padding: 16px 12px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .table-row {
          transition: all 0.2s;

          &:hover {
            background: rgba(var(--primary-rgb), 0.04);
          }
        }

        .date-value {
          display: block;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .time-value {
          display: block;
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .category-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(var(--primary-rgb), 0.12);
          color: var(--primary-color);
          border-radius: 6px;
          font-weight: 500;
          font-size: 13px;

          .chip-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }

        .description-text {
          color: var(--text-secondary);
          font-size: 14px;
          display: block;
          max-width: 300px;
          white-space: normal;
        }

        .amount-value {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 14px;
          display: block;
        }

        .delete-btn {
          color: var(--error-color);
          opacity: 0.7;
          transition: all 0.2s;

          &:hover {
            opacity: 1;
            background: rgba(244, 67, 54, 0.1);
          }
        }
      }
    }

    // ============================================
    // NO DATA STATE
    // ============================================

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-tertiary);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin: 0 auto 16px;
        opacity: 0.4;
      }

      h3 {
        margin: 16px 0 8px;
        color: var(--text-secondary);
        font-size: 18px;
        font-weight: 600;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    // ============================================
    // RESPONSIVE
    // ============================================

    @media (max-width: 900px) {
      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .expense-table {
        font-size: 12px;

        th, td {
          padding: 12px 8px;
        }
      }
    }

    @media (max-width: 600px) {
      .expense-section {
        margin: 16px auto;
        padding: 0 8px;
      }

      .controls-card .control-header {
        flex-direction: column;
        align-items: flex-start;

        h3 {
          width: 100%;
        }
      }

      .view-toggle {
        width: 100%;

        mat-button-toggle {
          flex: 1;
          min-width: auto;
        }
      }

      .summary-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .category-chips {
        flex-direction: column;

        .category-chip {
          width: 100%;
          justify-content: space-between;
        }
      }

      .table-wrapper {
        font-size: 12px;

        .expense-table {
          th, td {
            padding: 8px 4px;
          }

          .description-text {
            max-width: 150px;
          }
        }
      }
    }
  `]
})
export class ExpenseListComponent implements OnInit {
  currentView: ViewType = 'month';
  filteredExpenses: Expense[] = [];
  displayedColumns = ['date', 'category', 'description', 'amount', 'actions'];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseService.expenses$.subscribe(() => {
      this.updateFilteredExpenses();
    });
    this.updateFilteredExpenses();
  }

  onViewChange(): void {
    this.updateFilteredExpenses();
  }

  private updateFilteredExpenses(): void {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (this.currentView) {
      case 'day':
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        break;
      case 'week':
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case 'month':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
    }

    this.filteredExpenses = this.expenseService
      .getExpensesByDateRange(startDate, endDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  getAverageAmount(): number {
    if (this.filteredExpenses.length === 0) return 0;
    return this.getTotalAmount() / this.filteredExpenses.length;
  }

  getCategoryBreakdown(): { [key: string]: number } {
    return this.expenseService.getTotalByCategory(this.filteredExpenses);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Food': 'restaurant',
      'Transport': 'directions_car',
      'Entertainment': 'movie',
      'Utilities': 'bolt',
      'Health': 'local_hospital',
      'Shopping': 'shopping_bag',
      'Custom': 'label'
    };
    return icons[category] || 'tag';
  }

  deleteExpense(id: string): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id);
    }
  }
}