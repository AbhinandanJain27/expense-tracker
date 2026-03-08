import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export const SYSTEM_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Health',
  'Shopping',
  'Custom'
];

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<string[]>(SYSTEM_CATEGORIES);
  public categories$: Observable<string[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const categories = JSON.parse(stored);
      this.categoriesSubject.next(categories);
    } else {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(SYSTEM_CATEGORIES));
    }
  }

  getCategories(): string[] {
    return this.categoriesSubject.value;
  }

  addCategory(name: string): void {
    const trimmed = name.trim();
    const current = this.categoriesSubject.value;

    if (trimmed && !current.includes(trimmed)) {
      const updated = [...current, trimmed];
      this.categoriesSubject.next(updated);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }
  }

  deleteCategory(name: string): void {
    if (!SYSTEM_CATEGORIES.includes(name)) {
      const current = this.categoriesSubject.value.filter(c => c !== name);
      this.categoriesSubject.next(current);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
    }
  }
}