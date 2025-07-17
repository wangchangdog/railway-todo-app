import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDateTimeForInput,
  formatDateTimeForDisplay,
  calculateTimeRemaining,
  isOverdue,
  convertToServerFormat,
} from './dateUtils';

describe('dateUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateTimeForInput', () => {
    it('should format a valid date string to datetime-local format', () => {
      const dateString = '2024-01-15T10:30:00';
      const result = formatDateTimeForInput(dateString);
      expect(result).toBe('2024-01-15T10:30');
    });

    it('should return empty string for null input', () => {
      const result = formatDateTimeForInput(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = formatDateTimeForInput(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      const result = formatDateTimeForInput('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('formatDateTimeForDisplay', () => {
    it('should format a valid date string to display format', () => {
      const dateString = '2024-01-15T10:30:00';
      const result = formatDateTimeForDisplay(dateString);
      expect(result).toBe('2024/01/15 10:30');
    });

    it('should return empty string for null input', () => {
      const result = formatDateTimeForDisplay(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = formatDateTimeForDisplay(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for invalid date string', () => {
      const result = formatDateTimeForDisplay('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('calculateTimeRemaining', () => {
    it('should return overdue for past dates', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const pastDate = '2024-01-15T10:00:00';
      const result = calculateTimeRemaining(pastDate);

      expect(result).toEqual({ isOverdue: true, text: '期限切れ' });
    });

    it('should calculate remaining time in minutes', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const futureDate = '2024-01-15T12:30:00';
      const result = calculateTimeRemaining(futureDate);

      expect(result).toEqual({ isOverdue: false, text: '30分' });
    });

    it('should calculate remaining time in hours and minutes', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const futureDate = '2024-01-15T14:30:00';
      const result = calculateTimeRemaining(futureDate);

      expect(result).toEqual({ isOverdue: false, text: '2時間30分' });
    });

    it('should calculate remaining time in days, hours, and minutes', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const futureDate = '2024-01-17T14:30:00';
      const result = calculateTimeRemaining(futureDate);

      expect(result).toEqual({ isOverdue: false, text: '2日2時間30分' });
    });

    it('should calculate remaining time in days and minutes only', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const futureDate = '2024-01-17T12:30:00';
      const result = calculateTimeRemaining(futureDate);

      expect(result).toEqual({ isOverdue: false, text: '2日30分' });
    });

    it('should return null for null input', () => {
      const result = calculateTimeRemaining(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = calculateTimeRemaining(undefined);
      expect(result).toBeNull();
    });

    it('should return null for invalid date string', () => {
      const result = calculateTimeRemaining('invalid-date');
      expect(result).toBeNull();
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const pastDate = '2024-01-15T10:00:00';
      const result = isOverdue(pastDate);

      expect(result).toBe(true);
    });

    it('should return false for future dates', () => {
      const now = new Date('2024-01-15T12:00:00');
      vi.setSystemTime(now);

      const futureDate = '2024-01-15T14:00:00';
      const result = isOverdue(futureDate);

      expect(result).toBe(false);
    });

    it('should return false for null input', () => {
      const result = isOverdue(null);
      expect(result).toBe(false);
    });

    it('should return false for undefined input', () => {
      const result = isOverdue(undefined);
      expect(result).toBe(false);
    });

    it('should return false for invalid date string', () => {
      const result = isOverdue('invalid-date');
      expect(result).toBe(false);
    });
  });

  describe('convertToServerFormat', () => {
    it('should convert datetime-local format to server format', () => {
      const dateTimeLocal = '2024-01-15T10:30';
      const result = convertToServerFormat(dateTimeLocal);
      expect(result).toMatch(/2024-01-15T\d{2}:30:00/);
    });

    it('should return null for null input', () => {
      const result = convertToServerFormat(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = convertToServerFormat(undefined);
      expect(result).toBeNull();
    });

    it('should return null for invalid date string', () => {
      const result = convertToServerFormat('invalid-date');
      expect(result).toBeNull();
    });
  });
});
