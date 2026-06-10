import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function calcLectureScore(watched: boolean, notesMade: boolean, shortNotesMade: boolean): number {
  return (watched ? 50 : 0) + (notesMade ? 25 : 0) + (shortNotesMade ? 25 : 0);
}

export function calcReadiness(lecturePct: number, practicePct: number, revisionPct: number, mockAvgScore: number): number {
  return Math.round(lecturePct * 0.30 + practicePct * 0.40 + revisionPct * 0.20 + mockAvgScore * 0.10);
}

export function getConfidenceLabel(level: number): string {
  const labels = ['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
  return labels[level] || 'Unknown';
}

export function getConfidenceColor(level: number): string {
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  return colors[level] || '#6b7280';
}
