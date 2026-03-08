import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Theme {
  name: string;
  lightPalette: {
    bg: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    borderColor: string;
  };
  darkPalette: {
    bg: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    borderColor: string;
  };
  accentColor: string;
  accentColorRGB: string;
  vibe: string;
}

export const THEMES: { [key: string]: Theme } = {
  cyber: {
    name: 'Cyber Slate',
    lightPalette: {
      bg: '#F5F7FA',
      surface: '#FFFFFF',
      textPrimary: '#1a1a1a',
      textSecondary: '#666666',
      textTertiary: '#999999',
      borderColor: '#E0E0E0'
    },
    darkPalette: {
      bg: '#0F0F0F',
      surface: '#1A1A1A',
      textPrimary: '#FFFFFF',
      textSecondary: '#B3B3B3',
      textTertiary: '#808080',
      borderColor: '#2A2A2A'
    },
    accentColor: '#4B68FF',
    accentColorRGB: '75, 104, 255',
    vibe: 'Clean, tech-focused'
  },
  emerald: {
    name: 'Emerald Wealth',
    lightPalette: {
      bg: '#F1F4F1',
      surface: '#FFFFFF',
      textPrimary: '#0A3A0A',
      textSecondary: '#4A6A4A',
      textTertiary: '#7A8A7A',
      borderColor: '#D4E4D4'
    },
    darkPalette: {
      bg: '#0A1A10',
      surface: '#132817',
      textPrimary: '#E8F5E8',
      textSecondary: '#A8D4A8',
      textTertiary: '#70A070',
      borderColor: '#2A3A2A'
    },
    accentColor: '#2E7D32',
    accentColorRGB: '46, 125, 50',
    vibe: 'Trustworthy, financial'
  },
  nordic: {
    name: 'Nordic Night',
    lightPalette: {
      bg: '#F0F4F8',
      surface: '#FFFFFF',
      textPrimary: '#1B262C',
      textSecondary: '#3B5998',
      textTertiary: '#6B7F99',
      borderColor: '#D1D9E8'
    },
    darkPalette: {
      bg: '#1B262C',
      surface: '#243447',
      textPrimary: '#F0F4F8',
      textSecondary: '#C5D3E8',
      textTertiary: '#8A98B3',
      borderColor: '#364758'
    },
    accentColor: '#FF6B6B',
    accentColorRGB: '255, 107, 107',
    vibe: 'Modern, premium'
  },
  sunset: {
    name: 'Sunset Bliss',
    lightPalette: {
      bg: '#FEF7F5',
      surface: '#FFFFFF',
      textPrimary: '#3D2817',
      textSecondary: '#8B4513',
      textTertiary: '#A0693D',
      borderColor: '#E8D5C4'
    },
    darkPalette: {
      bg: '#2C1810',
      surface: '#3D2817',
      textPrimary: '#FEF7F5',
      textSecondary: '#E8B8A0',
      textTertiary: '#B8956A',
      borderColor: '#4D3820'
    },
    accentColor: '#FF8A65',
    accentColorRGB: '255, 138, 101',
    vibe: 'Warm, inviting'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'selectedTheme';
  private readonly DARK_MODE_KEY = 'darkMode';

  private currentThemeSubject = new BehaviorSubject<string>('nordic');
  private darkModeSubject = new BehaviorSubject<boolean>(true);

  public currentTheme$: Observable<string> = this.currentThemeSubject.asObservable();
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    this.loadPreferences();
    this.applyTheme();
  }

  private loadPreferences(): void {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    const savedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);

    if (savedTheme && THEMES[savedTheme]) {
      this.currentThemeSubject.next(savedTheme);
    }
    if (savedDarkMode !== null) {
      this.darkModeSubject.next(JSON.parse(savedDarkMode));
    }
  }

  setTheme(themeName: string): void {
    if (THEMES[themeName]) {
      this.currentThemeSubject.next(themeName);
      localStorage.setItem(this.THEME_STORAGE_KEY, themeName);
      this.applyTheme();
    }
  }

  toggleDarkMode(): void {
    const newState = !this.darkModeSubject.value;
    this.darkModeSubject.next(newState);
    localStorage.setItem(this.DARK_MODE_KEY, JSON.stringify(newState));
    this.applyTheme();
  }

  private applyTheme(): void {
    const themeName = this.currentThemeSubject.value;
    const isDark = this.darkModeSubject.value;
    const theme = THEMES[themeName];

    if (!theme) return;

    const palette = isDark ? theme.darkPalette : theme.lightPalette;
    const root = document.documentElement;

    // Apply all CSS variables
    root.style.setProperty('--primary-color', theme.accentColor);
    root.style.setProperty('--primary-rgb', theme.accentColorRGB);
    root.style.setProperty('--bg-color', palette.bg);
    root.style.setProperty('--surface-color', palette.surface);
    root.style.setProperty('--text-primary', palette.textPrimary);
    root.style.setProperty('--text-secondary', palette.textSecondary);
    root.style.setProperty('--text-tertiary', palette.textTertiary);
    root.style.setProperty('--border-color', palette.borderColor);

    // Update body
    document.body.style.backgroundColor = palette.bg;
    document.body.style.color = palette.textPrimary;
  }

  getCurrentTheme(): Theme {
    return THEMES[this.currentThemeSubject.value];
  }

  getThemeList(): { [key: string]: Theme } {
    return THEMES;
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}