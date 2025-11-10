import { UserInputs } from '../types';

const STORAGE_KEY = 'investment_quiz_progress';

export function saveProgress(inputs: Partial<UserInputs>): void {
  try {
    const existing = loadProgress();
    const updated = { ...existing, ...inputs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function loadProgress(): Partial<UserInputs> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return {};
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

