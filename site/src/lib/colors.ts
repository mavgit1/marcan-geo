// Blue (good) to red (bad): readable for red-green colour blindness, where a
// green-to-red scale is not. Values are CSS variables defined in app.css so
// they adapt to dark mode.

import type { StatusKey } from './i18n';

export const statusVar: Record<StatusKey, string> = {
	blocked: 'var(--s-blocked)',
	filtered: 'var(--s-filtered)',
	monitoring: 'var(--s-monitoring)',
	none: 'var(--s-none)',
	unknown: 'url(#hatch)'
};

/** Bins for the canton map (share enforcing). */
export const shareBins = [0.2, 0.4, 0.6, 0.8];
export const shareVars = ['var(--b0)', 'var(--b1)', 'var(--b2)', 'var(--b3)', 'var(--b4)'];

export const shareVar = (x: number): string => shareVars[shareBins.filter((b) => x >= b).length];
