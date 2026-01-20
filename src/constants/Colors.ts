export const Colors = {
  dark: {
    bg:          '#0f172a',
    surface:     '#1e293b',
    surface2:    '#334155',
    border:      '#334155',
    text:        '#f1f5f9',
    textMuted:   '#94a3b8',
    accent:      '#6366f1',
    accentDark:  '#4f46e5',
    success:     '#22c55e',
    warning:     '#f59e0b',
    danger:      '#ef4444',
  },
  light: {
    bg:          '#f8fafc',
    surface:     '#ffffff',
    surface2:    '#f1f5f9',
    border:      '#e2e8f0',
    text:        '#0f172a',
    textMuted:   '#64748b',
    accent:      '#6366f1',
    accentDark:  '#4f46e5',
    success:     '#16a34a',
    warning:     '#d97706',
    danger:      '#dc2626',
  },
} as const;

export type ThemeColors = typeof Colors.dark;
