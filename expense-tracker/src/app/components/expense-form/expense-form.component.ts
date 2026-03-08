import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule
  ],
  template: `
    <mat-card class="form-card">
      <mat-card-header>
        <mat-icon class="header-icon">add_circle_outline</mat-icon>
        <h2>Add New Expense</h2>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()">
          <!-- Category Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category *</mat-label>
            <mat-select formControlName="category">
              <mat-option *ngFor="let cat of categories$ | async" [value]="cat">
                <mat-icon class="category-icon">{{ getCategoryIcon(cat) }}</mat-icon>
                {{ cat }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Amount Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Amount (₹) *</mat-label>
            <span matPrefix>₹&nbsp;</span>
            <input
              matInput
              type="number"
              formControlName="amount"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            <mat-hint>Enter amount in Indian Rupees</mat-hint>
          </mat-form-field>

          <!-- Date Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date *</mat-label>
            <input
              matInput
              [matDatepicker]="picker"
              formControlName="date"
              readonly
            />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <!-- Description Field -->
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description / Notes</mat-label>
            <textarea
              matInput
              formControlName="description"
              rows="3"
              placeholder="What was this expense for?"
              maxlength="200"
            ></textarea>
            <mat-hint align="end">
              {{ expenseForm.get('description')?.value?.length || 0 }}/200
            </mat-hint>
          </mat-form-field>

          <!-- Action Buttons -->
          <div class="button-group">
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="expenseForm.invalid"
              class="submit-btn"
            >
              <mat-icon>check_circle</mat-icon>
              <span>Add Expense</span>
            </button>
            <button 
              mat-stroked-button 
              type="button" 
              (click)="onReset()"
              class="reset-btn"
            >
              <mat-icon>refresh</mat-icon>
              <span>Reset</span>
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
styles: [`
    .form-card {
      background: var(--surface-color);
      color: var(--text-primary);
      max-width: 600px;
      margin: 24px auto;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 4px 12px var(--shadow-color);

      mat-card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--primary-color);

        .header-icon {
          color: var(--primary-color);
          font-size: 28px;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 24px;
          font-weight: 600;
        }
      }

      mat-card-content {
        padding: 0;

        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      }
    }

    .full-width {
      width: 100%;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;

      button {
        flex: 1;
        height: 44px;
        font-size: 14px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 8px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        mat-icon {
          margin-right: 8px;
        }
      }

      .submit-btn {
        background: var(--primary-color);
        color: white;

        &:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(var(--primary-rgb), 0.4);
        }
      }

      .reset-btn {
        color: var(--primary-color);
        border-color: var(--primary-color);

        &:hover {
          background: rgba(var(--primary-rgb), 0.08);
        }
      }
    }

    ::ng-deep {
      .mat-mdc-form-field-label {
        color: var(--text-secondary) !important;
      }

      .mat-mdc-text-field-wrapper {
        background-color: rgba(var(--primary-rgb), 0.03) !important;
      }

      .mat-mdc-form-field-focus-overlay {
        background-color: var(--primary-color) !important;
        opacity: 0.06 !important;
      }
    }

    // ============================================
    // TABLET - 768px
    // ============================================

    @media (max-width: 768px) {
      .form-card {
        margin: 16px auto;
        max-width: calc(100% - 16px);

        mat-card-header {
          gap: 10px;
          padding-bottom: 12px;
          margin-bottom: 16px;

          .header-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }

          h2 {
            font-size: 20px;
          }
        }

        mat-card-content {
          form {
            gap: 12px;
          }
        }
      }

      .button-group {
        gap: 10px;
        margin-top: 16px;

        button {
          height: 40px;
          font-size: 13px;
        }
      }
    }

    // ============================================
    // MOBILE - 480px
    // ============================================
@media (max-width: 1024px) {
      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
      }

      .expense-table {
        font-size: 12px;

        th, td {
          padding: 12px 8px;
        }
      }

      .category-chips .category-chip {
        font-size: 12px;
        padding: 6px 10px;
      }
    }

    @media (max-width: 768px) {
      .expense-section {
        margin: 16px auto;
        padding: 0 12px;
      }

      .controls-card {
        padding: 12px;

        .control-header {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;

          h3 {
            margin: 0;
            font-size: 16px;
          }

          .view-toggle {
            width: 100%;
          }
        }
      }

      .summary-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
        margin-bottom: 16px;
      }

      .summary-card {
        padding: 16px;
        gap: 12px;
        border-radius: 8px;

        .card-icon {
          width: 48px;
          height: 48px;

          mat-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
        }

        .card-value {
          font-size: 18px;
        }

        .card-label {
          font-size: 11px;
        }
      }

      .category-card {
        padding: 16px;
        margin-bottom: 16px;

        h4 {
          font-size: 14px;
          margin-bottom: 12px;
        }

        .category-chips {
          gap: 8px;

          .category-chip {
            font-size: 11px;
            padding: 6px 10px;
            flex: 1;
            min-width: 100px;

            .chip-label {
              min-width: 60px;
            }

            .chip-amount {
              font-size: 11px;
              margin-left: 4px;
              padding-left: 4px;
            }
          }
        }
      }

      .table-card {
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
      }

      .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 8px;

        &::-webkit-scrollbar {
          height: 4px;
        }
      }

      .expense-table {
        font-size: 11px;

        th {
          padding: 10px 6px;
          font-size: 10px;

          .col-icon {
            display: none;
          }
        }

        td {
          padding: 10px 6px;
          font-size: 11px;
        }

        .date-value {
          font-size: 11px;
          margin-bottom: 2px;
        }

        .time-value {
          font-size: 9px;
        }

        .category-badge {
          padding: 4px 8px;
          font-size: 10px;
          gap: 4px;

          .chip-icon {
            display: none;
          }
        }

        .description-text {
          max-width: 120px;
          font-size: 10px;
        }

        .amount-value {
          font-size: 11px;
        }

        .delete-btn {
          padding: 4px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .no-data {
        padding: 40px 20px;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
        }

        h3 {
          font-size: 16px;
          margin: 12px 0 8px;
        }

        p {
          font-size: 12px;
        }
      }
    }

    @media (max-width: 480px) {
      .expense-section {
        margin: 8px auto;
        padding: 0 8px;
      }

      .controls-card {
        padding: 10px;
        margin-bottom: 12px;

        .control-header {
          gap: 10px;

          h3 {
            font-size: 14px;
            width: 100%;
            margin-bottom: 0;
          }

          .view-toggle {
            width: 100%;

            mat-button-toggle {
              flex: 1;
              min-width: auto;
              font-size: 10px;
              padding: 4px 2px;

              mat-icon {
                font-size: 14px;
                width: 14px;
                height: 14px;
                margin-right: 2px;
              }

              span {
                display: none;
              }
            }
          }
        }
      }

      .summary-grid {
        grid-template-columns: 1fr;
        gap: 10px;
        margin-bottom: 12px;
      }

      .summary-card {
        padding: 12px;
        gap: 10px;

        .card-icon {
          width: 40px;
          height: 40px;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .card-label {
          font-size: 10px;
        }

        .card-value {
          font-size: 16px;
        }
      }

      .category-card {
        padding: 12px;
        margin-bottom: 12px;

        h4 {
          font-size: 12px;
          margin-bottom: 10px;
        }

        .category-chips {
          flex-direction: column;
          gap: 6px;

          .category-chip {
            width: 100%;
            font-size: 10px;
            padding: 8px;
            justify-content: space-between;

            .chip-icon {
              display: none;
            }

            .chip-label {
              min-width: 80px;
            }
          }
        }
      }

      .table-card {
        padding: 0;
      }

      .table-wrapper {
        font-size: 10px;
        border-radius: 6px;
      }

      .expense-table {
        font-size: 9px;

        th {
          padding: 8px 4px;
          font-size: 9px;

          .col-icon {
            display: none;
          }
        }

        td {
          padding: 8px 4px;
        }

        .date-value {
          font-size: 10px;
        }

        .time-value {
          font-size: 8px;
        }

        .category-badge {
          padding: 2px 6px;
          font-size: 8px;
          border-radius: 4px;
        }

        .description-text {
          max-width: 80px;
          font-size: 9px;
          white-space: normal;
        }

        .amount-value {
          font-size: 10px;
          font-weight: 700;
        }

        .delete-btn {
          padding: 2px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .no-data {
        padding: 30px 15px;

        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          margin-bottom: 10px;
        }

        h3 {
          font-size: 14px;
          margin: 10px 0 6px;
        }

        p {
          font-size: 11px;
          margin: 0;
        }
      }
    }
  `]
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;
  categories$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.categories$;

    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), Validators.required],
      description: ['']
    });
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

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.expenseService.addExpense(this.expenseForm.value);
      this.expenseForm.reset({
        category: '',
        amount: null,
        date: new Date(),
        description: ''
      });
    }
  }

  onReset(): void {
    this.expenseForm.reset({
      category: '',
      amount: null,
      date: new Date(),
      description: ''
    });
  }
}