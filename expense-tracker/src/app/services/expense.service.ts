import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly STORAGE_KEY = 'expenses';
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  public expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const expenses = JSON.parse(stored).map((e: any) => ({
        ...e,
        date: new Date(e.date),
        createdAt: new Date(e.createdAt)
      }));
      this.expensesSubject.next(expenses);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.expensesSubject.value)
    );
  }

  addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): void {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const current = this.expensesSubject.value;
    this.expensesSubject.next([...current, newExpense]);
    this.saveToLocalStorage();
  }

  updateExpense(id: string, updates: Partial<Expense>): void {
    const current = this.expensesSubject.value;
    const updated = current.map(e =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.expensesSubject.next(updated);
    this.saveToLocalStorage();
  }

  deleteExpense(id: string): void {
    const current = this.expensesSubject.value.filter(e => e.id !== id);
    this.expensesSubject.next(current);
    this.saveToLocalStorage();
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
    return this.expensesSubject.value.filter(
      e => e.date >= startDate && e.date <= endDate
    );
  }

  getTotalByCategory(expenses: Expense[]): { [key: string]: number } {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });
  }
}